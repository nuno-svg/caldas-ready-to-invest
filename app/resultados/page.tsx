import Link from "next/link";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "Indicadores | Caldas Ready to Invest" };

export default function ResultsPage() {
  return (
    <main className="dashboard-shell">
      <header className="survey-header dashboard-header">
        <Link className="brand" href="/"><span className="brand-mark">CR</span><span><b>CALDAS</b><small>READY TO INVEST</small></span></Link>
        <nav><Link href="/questionario">Responder</Link><span>Painel de indicadores</span></nav>
      </header>
      <DashboardClient />
    </main>
  );
}
