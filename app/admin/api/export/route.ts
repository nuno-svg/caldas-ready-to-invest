import { getAdminIdentity } from "../../../../lib/admin-auth";
import { listAdminSubmissions, submissionsToCsv } from "../../../../lib/admin-data";

export async function GET(request: Request) {
  const identity = getAdminIdentity(request.headers);
  if (!identity) return new Response("Acesso reservado.", { status: 401, headers: { "Cache-Control": "no-store" } });
  try {
    const csv = submissionsToCsv(await listAdminSubmissions());
    const date = new Date().toISOString().slice(0, 10);
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="respostas-ready-to-invest-${date}.csv"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Não foi possível exportar as respostas.", { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
