import Link from "next/link";
import SurveyForm from "./SurveyForm";

export const metadata = { title: "Questionário | Caldas Ready to Invest" };

export default function QuestionnairePage() {
  return (
    <main className="survey-shell">
      <header className="survey-header">
        <Link className="brand" href="/"><span className="brand-mark">CR</span><span><b>CALDAS</b><small>READY TO INVEST</small></span></Link>
        <span>Questionário ao ecossistema económico</span>
      </header>
      <SurveyForm />
    </main>
  );
}
