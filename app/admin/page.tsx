import { headers } from "next/headers";
import Link from "next/link";
import { getAdminIdentity } from "../../lib/admin-auth";
import AdminClient from "./AdminClient";

export const metadata = { title: "Área reservada | Caldas Ready to Invest" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const identity = getAdminIdentity(await headers());
  if (!identity) {
    return (
      <main className="admin-denied">
        <span className="brand-mark logo-mark" aria-hidden="true" />
        <span className="section-kicker">ÁREA RESERVADA</span>
        <h1>Acesso não autorizado.</h1>
        <p>Esta área contém dados de contacto e respostas individuais. Entre através do endereço protegido com um dos emails autorizados.</p>
        <Link className="primary" href="/">Voltar ao projeto <span>→</span></Link>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="brand" href="/"><span className="brand-mark logo-mark" aria-hidden="true" /><span><b>CALDAS</b><small>READY TO INVEST</small></span></Link>
        <div className="admin-session"><span>Área reservada</span><b>{identity.email}</b>{!identity.local && <a href="/cdn-cgi/access/logout">Terminar sessão</a>}</div>
      </header>
      <AdminClient />
    </main>
  );
}
