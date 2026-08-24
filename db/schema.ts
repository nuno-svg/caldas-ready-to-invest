import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const submissions = sqliteTable(
  "submissions",
  {
    id: text("id").primaryKey(),
    createdAt: text("created_at").notNull(),
    respondentName: text("respondent_name").notNull(),
    respondentEmail: text("respondent_email").notNull(),
    organization: text("organization").notNull(),
    role: text("role").notNull().default(""),
    archetype: text("archetype").notNull(),
    consent: integer("consent", { mode: "boolean" }).notNull(),
    overallScore: integer("overall_score").notNull(),
    maturityBand: text("maturity_band").notNull(),
    responsesJson: text("responses_json").notNull(),
    themesJson: text("themes_json").notNull(),
  },
  (table) => [
    index("idx_submissions_created_at").on(table.createdAt),
    index("idx_submissions_archetype").on(table.archetype),
  ],
);

export const dimensionScores = sqliteTable(
  "dimension_scores",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    submissionId: text("submission_id").notNull(),
    dimension: text("dimension").notNull(),
    readiness: integer("readiness").notNull(),
    priority: integer("priority").notNull(),
  },
  (table) => [
    index("idx_dimension_scores_submission").on(table.submissionId),
    index("idx_dimension_scores_dimension").on(table.dimension),
  ],
);
