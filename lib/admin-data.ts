import { ensureSchema, getD1 } from "../db";
import { archetypes, dimensions } from "./questionnaire";

type Row = Record<string, string | number | null>;
type StoredAnswer = { dimension: string; question?: string; answer: string; readiness: number; priority: number };

export type AdminSubmission = {
  id: string;
  createdAt: string;
  respondentName: string;
  respondentEmail: string;
  organization: string;
  role: string;
  archetype: string;
  archetypeName: string;
  overallScore: number;
  maturityBand: string;
  answers: StoredAnswer[];
  themes: { theme: string; count: number }[];
};

function parseJson<T>(value: unknown, fallback: T): T {
  try { return JSON.parse(String(value ?? "")) as T; } catch { return fallback; }
}

export async function listAdminSubmissions(): Promise<AdminSubmission[]> {
  await ensureSchema();
  const d1 = getD1();
  const result = await d1.prepare(`SELECT id, created_at, respondent_name, respondent_email, organization, role,
    archetype, overall_score, maturity_band, responses_json, themes_json
    FROM submissions ORDER BY created_at DESC LIMIT 1000`).all<Row>();
  const archetypeNames = new Map(archetypes.map((item) => [item.id, item.name]));
  return result.results.map((row) => ({
    id: String(row.id),
    createdAt: String(row.created_at),
    respondentName: String(row.respondent_name),
    respondentEmail: String(row.respondent_email),
    organization: String(row.organization),
    role: String(row.role ?? ""),
    archetype: String(row.archetype),
    archetypeName: archetypeNames.get(String(row.archetype) as (typeof archetypes)[number]["id"]) ?? String(row.archetype),
    overallScore: Number(row.overall_score),
    maturityBand: String(row.maturity_band),
    answers: parseJson<StoredAnswer[]>(row.responses_json, []),
    themes: parseJson<{ theme: string; count: number }[]>(row.themes_json, []),
  }));
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function submissionsToCsv(items: AdminSubmission[]) {
  const headers = ["Data", "Nome", "Email", "Organização", "Função", "Perfil", "Índice", "Faixa"];
  for (const dimension of dimensions) headers.push(`${dimension.title} — resposta`, `${dimension.title} — preparação`, `${dimension.title} — prioridade`);
  const lines = [headers.map(csvCell).join(";")];
  for (const item of items) {
    const row: unknown[] = [item.createdAt, item.respondentName, item.respondentEmail, item.organization, item.role, item.archetypeName, item.overallScore, item.maturityBand];
    for (const dimension of dimensions) {
      const answer = item.answers.find((entry) => entry.dimension === dimension.id);
      row.push(answer?.answer ?? "", answer?.readiness ?? "", answer?.priority ?? "");
    }
    lines.push(row.map(csvCell).join(";"));
  }
  return `\uFEFF${lines.join("\r\n")}`;
}
