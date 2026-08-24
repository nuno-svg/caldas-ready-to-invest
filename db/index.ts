import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getD1() {
  if (!env.DB) throw new Error("Base de dados indisponível.");
  return env.DB;
}

export function getDb() {
  return drizzle(getD1(), { schema });
}

export async function ensureSchema() {
  const d1 = getD1();
  await d1.batch([
    d1.prepare(`CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      respondent_name TEXT NOT NULL,
      respondent_email TEXT NOT NULL,
      organization TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT '',
      archetype TEXT NOT NULL,
      consent INTEGER NOT NULL,
      overall_score INTEGER NOT NULL,
      maturity_band TEXT NOT NULL,
      responses_json TEXT NOT NULL,
      themes_json TEXT NOT NULL
    )`),
    d1.prepare(`CREATE TABLE IF NOT EXISTS dimension_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id TEXT NOT NULL,
      dimension TEXT NOT NULL,
      readiness INTEGER NOT NULL,
      priority INTEGER NOT NULL
    )`),
    d1.prepare("CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS idx_submissions_archetype ON submissions(archetype)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS idx_dimension_scores_submission ON dimension_scores(submission_id)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS idx_dimension_scores_dimension ON dimension_scores(dimension)"),
  ]);
}
