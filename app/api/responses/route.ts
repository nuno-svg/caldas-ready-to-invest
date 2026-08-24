import { ensureSchema, getD1 } from "../../../db";
import { analyzeAnswers, type Answer } from "../../../lib/analysis";
import { archetypes, dimensions, questions } from "../../../lib/questionnaire";

function clean(value: unknown, max = 4000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const respondentName = clean(payload.respondentName, 160);
    const respondentEmail = clean(payload.respondentEmail, 240);
    const organization = clean(payload.organization, 240);
    const role = clean(payload.role, 160);
    const archetype = clean(payload.archetype, 1);
    const consent = payload.consent === true;
    const rawAnswers = Array.isArray(payload.answers) ? payload.answers : [];
    if (!respondentName || !respondentEmail || !organization || !archetypes.some((item) => item.id === archetype) || !consent) {
      return Response.json({ error: "Preencha os campos obrigatórios e confirme o consentimento." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(respondentEmail)) {
      return Response.json({ error: "Indique um email válido." }, { status: 400 });
    }
    const answers: Answer[] = dimensions.map((dimension) => {
      const source = rawAnswers.find((item) => typeof item === "object" && item && (item as { dimension?: string }).dimension === dimension.id) as Record<string, unknown> | undefined;
      return { dimension: dimension.id, answer: clean(source?.answer, 6000), readiness: Number(source?.readiness) || 0, priority: Number(source?.priority) || 0 };
    });
    if (answers.some((answer) => answer.answer.length < 20 || answer.readiness < 1 || answer.readiness > 5 || answer.priority < 1 || answer.priority > 5)) {
      return Response.json({ error: "Complete as cinco dimensões antes de submeter." }, { status: 400 });
    }
    const analysis = analyzeAnswers(answers);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await ensureSchema();
    const d1 = getD1();
    const questionnaire = questions[archetype];
    const enrichedAnswers = answers.map((answer) => ({ ...answer, question: questionnaire[answer.dimension].question }));
    await d1.batch([
      d1.prepare(`INSERT INTO submissions (id, created_at, respondent_name, respondent_email, organization, role, archetype, consent, overall_score, maturity_band, responses_json, themes_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(id, createdAt, respondentName, respondentEmail.toLowerCase(), organization, role, archetype, 1, analysis.score, analysis.band, JSON.stringify(enrichedAnswers), JSON.stringify(analysis.themes)),
      ...answers.map((answer) => d1.prepare("INSERT INTO dimension_scores (submission_id, dimension, readiness, priority) VALUES (?, ?, ?, ?)").bind(id, answer.dimension, answer.readiness, answer.priority)),
    ]);
    return Response.json({ id, score: analysis.score, band: analysis.band, themes: analysis.themes }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Não foi possível guardar a resposta. Tente novamente." }, { status: 500 });
  }
}
