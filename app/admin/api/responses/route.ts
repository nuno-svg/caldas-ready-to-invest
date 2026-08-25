import { getAdminIdentity } from "../../../../lib/admin-auth";
import { listAdminSubmissions } from "../../../../lib/admin-data";

export async function GET(request: Request) {
  const identity = getAdminIdentity(request.headers);
  if (!identity) return Response.json({ error: "Acesso reservado." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  try {
    const submissions = await listAdminSubmissions();
    return Response.json({ submissions, viewer: identity.email }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Não foi possível consultar as respostas." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
