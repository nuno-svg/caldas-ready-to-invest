import Link from "next/link";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "Resultados preliminares | Caldas Ready to Invest" };

export default function ResultsPage() {
  return (
    <main className="dashboard-shell">
      <header className="survey-header dashboard-header">
        <Link className="brand" href="/"><span className="brand-mark logo-mark" aria-hidden="true" /><span><b>CALDAS</b><small>READY TO INVEST</small></span></Link>
        <nav><a href="https://espacos.caldasreadytoinvest.pt">Piloto Espaços</a><Link href="/questionario">Participar</Link><Link href="/admin">Área reservada</Link><span>Resultados preliminares</span></nav>
      </header>
      <DashboardClient />
    </main>
  );
}
