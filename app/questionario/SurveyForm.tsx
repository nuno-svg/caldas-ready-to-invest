"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { archetypes, dimensions, questions, type DimensionId } from "../../lib/questionnaire";

type AnswerState = Record<DimensionId, { answer: string; readiness: number; priority: number }>;
const emptyAnswers = Object.fromEntries(dimensions.map((item) => [item.id, { answer: "", readiness: 0, priority: 0 }])) as AnswerState;

export default function SurveyForm() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ respondentName: "", respondentEmail: "", organization: "", role: "", archetype: "" });
  const [answers, setAnswers] = useState<AnswerState>(emptyAnswers);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ score: number; band: string; themes: { theme: string; count: number }[] } | null>(null);
  const currentDimension = step > 0 && step <= dimensions.length ? dimensions[step - 1] : null;
  const completion = Math.round((step / (dimensions.length + 1)) * 100);
  const selectedArchetype = archetypes.find((item) => item.id === profile.archetype);
  const currentQuestion = currentDimension && profile.archetype ? questions[profile.archetype][currentDimension.id] : null;
  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(profile.respondentName.trim() && profile.respondentEmail.trim() && profile.organization.trim() && profile.archetype);
    if (currentDimension) { const answer = answers[currentDimension.id]; return answer.answer.trim().length >= 20 && answer.readiness > 0 && answer.priority > 0; }
    return consent;
  }, [step, profile, currentDimension, answers, consent]);

  function next() {
    if (!canContinue) { setError(step === 0 ? "Preencha os campos obrigatórios e escolha o perfil da organização." : "Escreva uma resposta com pelo menos 20 caracteres e selecione as duas escalas."); return; }
    setError(""); setStep((value) => Math.min(value + 1, dimensions.length + 1)); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!consent) { setError("Confirme o consentimento para submeter a resposta."); return; }
    setSending(true); setError("");
    try {
      const response = await fetch("/api/responses", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...profile, consent, answers: dimensions.map((item) => ({ dimension: item.id, ...answers[item.id] })) }) });
      const data = await response.json() as { error?: string; score: number; band: string; themes: { theme: string; count: number }[] };
      if (!response.ok) throw new Error(data.error || "Não foi possível guardar a resposta.");
      setResult(data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível guardar a resposta."); }
    finally { setSending(false); }
  }

  if (result) return (
    <section className="thank-you">
      <span className="section-kicker">RESPOSTA REGISTADA</span><h1>Obrigado pelo seu contributo.</h1>
      <p>A resposta foi guardada no repositório e integrada automaticamente nos indicadores agregados.</p>
      <div className="result-score"><strong>{result.score}</strong><span>/100<small>{result.band}</small></span></div>
      {result.themes.length > 0 && <div className="theme-chips">{result.themes.map((item) => <span key={item.theme}>{item.theme}</span>)}</div>}
      <div className="thank-actions"><Link className="primary" href="/">Voltar ao início <span>→</span></Link><Link href="/resultados">Consultar indicadores</Link></div>
    </section>
  );

  return (
    <div className="survey-layout">
      <aside className="survey-progress">
        <span className="section-kicker">PROGRESSO</span><strong>{completion}%</strong>
        <div className="progress-track"><i style={{ width: `${completion}%` }} /></div>
        <ol><li className={step === 0 ? "active" : step > 0 ? "done" : ""}>Perfil</li>{dimensions.map((item, index) => <li key={item.id} className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""}>{item.short}</li>)}<li className={step === 6 ? "active" : ""}>Revisão</li></ol>
        <div className="privacy-note"><b>Uso dos dados</b><p>As respostas identificadas apoiam a análise técnica. A divulgação será feita apenas de forma agregada.</p></div>
      </aside>
      <section className="survey-panel">
        {step === 0 && <>
          <span className="step-number">00 · ENQUADRAMENTO</span><h1>Conte-nos quem está a responder.</h1><p className="lead">Os dados de contacto permitem validar o contributo e, se necessário, aprofundar algum ponto.</p>
          <div className="field-grid"><label>Nome completo *<input value={profile.respondentName} onChange={(e) => setProfile({ ...profile, respondentName: e.target.value })} /></label><label>Email profissional *<input type="email" value={profile.respondentEmail} onChange={(e) => setProfile({ ...profile, respondentEmail: e.target.value })} /></label><label>Organização *<input value={profile.organization} onChange={(e) => setProfile({ ...profile, organization: e.target.value })} /></label><label>Função<input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} /></label></div>
          <fieldset className="archetype-field"><legend>Qual o perfil que melhor descreve a organização? *</legend><div className="archetype-grid">{archetypes.map((item) => <label className={profile.archetype === item.id ? "selected" : ""} key={item.id}><input type="radio" name="archetype" value={item.id} checked={profile.archetype === item.id} onChange={() => setProfile({ ...profile, archetype: item.id })} /><b>{item.id}</b><span><strong>{item.name}</strong><small>{item.description}</small></span></label>)}</div></fieldset>
        </>}
        {currentDimension && currentQuestion && <>
          <span className="step-number">0{step} · {currentDimension.title.toUpperCase()}</span><h1>{currentQuestion.question}</h1><p className="lead"><b>Pista para aprofundar:</b> {currentQuestion.followUp}</p>
          <label className="answer-field">A sua perspetiva<textarea rows={8} placeholder="Partilhe um exemplo concreto, dificuldade sentida ou oportunidade identificada…" value={answers[currentDimension.id].answer} onChange={(e) => setAnswers({ ...answers, [currentDimension.id]: { ...answers[currentDimension.id], answer: e.target.value } })} /><small>{answers[currentDimension.id].answer.length} caracteres · mínimo 20</small></label>
          <Rating title="Como avalia a preparação atual de Caldas nesta dimensão?" low="Muito fraca" high="Muito forte" value={answers[currentDimension.id].readiness} onChange={(value) => setAnswers({ ...answers, [currentDimension.id]: { ...answers[currentDimension.id], readiness: value } })} />
          <Rating title="Qual é a prioridade de intervenção?" low="Baixa" high="Crítica" value={answers[currentDimension.id].priority} onChange={(value) => setAnswers({ ...answers, [currentDimension.id]: { ...answers[currentDimension.id], priority: value } })} />
        </>}
        {step === dimensions.length + 1 && <>
          <span className="step-number">06 · REVISÃO</span><h1>Confirme antes de submeter.</h1><p className="lead">Perfil selecionado: <b>{selectedArchetype?.name}</b>. Pode regressar a qualquer dimensão para rever a resposta.</p>
          <div className="review-list">{dimensions.map((item, index) => <button key={item.id} type="button" onClick={() => setStep(index + 1)}><span>0{index + 1}</span><div><b>{item.title}</b><small>{answers[item.id].answer.slice(0, 110)}{answers[item.id].answer.length > 110 ? "…" : ""}</small></div><strong>{answers[item.id].readiness}/5</strong></button>)}</div>
          <label className="consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>Confirmo que li a informação sobre o tratamento dos dados e autorizo a utilização desta resposta no diagnóstico do Kit do Investidor. A apresentação pública de resultados será agregada.</span></label>
        </>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="survey-actions">{step > 0 && <button className="secondary" type="button" onClick={() => { setError(""); setStep(step - 1); }}>← Anterior</button>}<button className="primary" type="button" disabled={!canContinue || sending} onClick={step === dimensions.length + 1 ? submit : next}>{sending ? "A guardar…" : step === dimensions.length + 1 ? "Submeter resposta" : "Continuar"}<span>→</span></button></div>
      </section>
    </div>
  );
}

function Rating({ title, low, high, value, onChange }: { title: string; low: string; high: string; value: number; onChange: (value: number) => void }) {
  return <fieldset className="rating"><legend>{title}</legend><div>{[1,2,3,4,5].map((number) => <label className={value === number ? "checked" : ""} key={number}><input type="radio" checked={value === number} onChange={() => onChange(number)} /><span>{number}</span></label>)}</div><small><span>{low}</span><span>{high}</span></small></fieldset>;
}
