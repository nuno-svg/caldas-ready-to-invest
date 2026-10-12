export type AdminIdentity = { email: string; local: boolean };

/**
 * Autenticação da área reservada.
 *
 * O acesso é feito através do Cloudflare Access. O token JWT que o Access envia
 * no cabeçalho `cf-access-jwt-assertion` é verificado criptograficamente
 * (assinatura RS256, audiência, emissor e validade). Os cabeçalhos do pedido,
 * por si só, nunca são considerados prova de identidade, porque qualquer
 * cliente os pode falsificar.
 *
 * Variáveis de ambiente (wrangler secrets / vars):
 *   CF_ACCESS_TEAM_DOMAIN  ex.: "minhaequipa.cloudflareaccess.com"
 *   CF_ACCESS_AUD          "Application Audience (AUD) Tag" da aplicação no Access
 *   ADMIN_EMAILS           (opcional) lista de emails autorizados, separados por vírgulas
 *   ADMIN_DEV_BYPASS       (apenas em desenvolvimento local) "true" para dispensar o Access.
 *                          NUNCA definir em produção.
 *
 * Se CF_ACCESS_TEAM_DOMAIN ou CF_ACCESS_AUD não estiverem definidos, o acesso é recusado.
 */

type AuthEnv = {
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
  ADMIN_DEV_BYPASS?: string;
};

type Jwk = JsonWebKey & { kid?: string };

const JWKS_TTL_MS = 10 * 60 * 1000;
let jwksCache: { url: string; keys: Jwk[]; fetchedAt: number } | null = null;

async function authEnv(): Promise<AuthEnv> {
  try {
    const { env } = await import("cloudflare:workers");
    return env as unknown as AuthEnv;
  } catch {
    // Fora do runtime Cloudflare (ex.: testes em Node) não há configuração: o acesso é recusado.
    return {};
  }
}

function base64UrlToBytes(input: string): Uint8Array<ArrayBuffer> {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodeJson<T>(segment: string): T | null {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlToBytes(segment))) as T;
  } catch {
    return null;
  }
}

async function getSigningKeys(teamDomain: string, forceRefresh = false): Promise<Jwk[]> {
  const url = `https://${teamDomain}/cdn-cgi/access/certs`;
  const now = Date.now();
  if (!forceRefresh && jwksCache && jwksCache.url === url && now - jwksCache.fetchedAt < JWKS_TTL_MS) {
    return jwksCache.keys;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Não foi possível obter as chaves do Cloudflare Access (${response.status}).`);
  const body = (await response.json()) as { keys?: Jwk[] };
  const keys = Array.isArray(body.keys) ? body.keys : [];
  jwksCache = { url, keys, fetchedAt: now };
  return keys;
}

async function verifyAccessJwt(token: string, teamDomain: string, audience: string): Promise<string | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;

  const header = decodeJson<{ alg?: string; kid?: string }>(headerB64);
  const payload = decodeJson<{ aud?: string | string[]; iss?: string; exp?: number; nbf?: number; email?: string }>(payloadB64);
  if (!header || !payload || header.alg !== "RS256" || !header.kid) return null;

  let keys = await getSigningKeys(teamDomain);
  let jwk = keys.find((key) => key.kid === header.kid);
  if (!jwk) {
    keys = await getSigningKeys(teamDomain, true);
    jwk = keys.find((key) => key.kid === header.kid);
  }
  if (!jwk) return null;

  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlToBytes(signatureB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`),
  );
  if (!valid) return null;

  const nowSeconds = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(audience)) return null;
  if (payload.iss !== `https://${teamDomain}`) return null;
  if (typeof payload.exp !== "number" || payload.exp < nowSeconds) return null;
  if (typeof payload.nbf === "number" && payload.nbf > nowSeconds + 60) return null;

  const email = payload.email?.trim().toLowerCase();
  return email || null;
}

function isAllowedEmail(email: string, allowList: string | undefined): boolean {
  if (!allowList?.trim()) return true; // Sem lista: a política do Cloudflare Access decide quem entra.
  const allowed = allowList.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email);
}

export async function getAdminIdentity(headers: Headers): Promise<AdminIdentity | null> {
  const config = await authEnv();

  if (config.ADMIN_DEV_BYPASS === "true") {
    return { email: "desenvolvimento@local", local: true };
  }

  const teamDomain = config.CF_ACCESS_TEAM_DOMAIN?.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const audience = config.CF_ACCESS_AUD?.trim();
  if (!teamDomain || !audience) {
    console.error("Área reservada: CF_ACCESS_TEAM_DOMAIN e CF_ACCESS_AUD não estão configurados. Acesso recusado.");
    return null;
  }

  const token = headers.get("cf-access-jwt-assertion");
  if (!token) return null;

  try {
    const email = await verifyAccessJwt(token, teamDomain, audience);
    if (!email || !isAllowedEmail(email, config.ADMIN_EMAILS)) return null;
    return { email, local: false };
  } catch (error) {
    console.error("Área reservada: falha na verificação do token do Cloudflare Access.", error);
    return null;
  }
}
