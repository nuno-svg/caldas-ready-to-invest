export type AdminIdentity = { email: string; local: boolean };

export function getAdminIdentity(headers: Headers): AdminIdentity | null {
  const host = (headers.get("x-forwarded-host") ?? headers.get("host") ?? "").toLowerCase();
  const hostname = host.split(":")[0];
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return { email: "desenvolvimento@local", local: true };
  }

  const email = headers.get("cf-access-authenticated-user-email")?.trim().toLowerCase();
  const accessAssertion = headers.get("cf-access-jwt-assertion");
  if (!email || !accessAssertion) return null;
  return { email, local: false };
}
