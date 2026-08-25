import Link from "next/link";
import SurveyForm from "./SurveyForm";

export const metadata = { title: "Auscultação | Caldas Ready to Invest" };

export default function QuestionnairePage() {
  return (
    <main className="survey-shell">
      <header className="survey-header">
        <Link className="brand" href="/"><span className="brand-mark logo-mark" aria-hidden="true" /><span><b>CALDAS</b><small>READY TO INVEST</small></span></Link>
        <span>Fase de auscultação · Questionário ao ecossistema económico</span>
      </header>
      <SurveyForm />
    </main>
  );
}
