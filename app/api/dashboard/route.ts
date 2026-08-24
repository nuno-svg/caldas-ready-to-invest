import { ensureSchema, getD1 } from "../../../db";
import { archetypes, dimensions } from "../../../lib/questionnaire";
type Row = Record<string, string | number | null>;

export async function GET() {
  try {
    await ensureSchema();
    const d1 = getD1();
    const [summary, byDimension, byArchetype, themeRows] = await Promise.all([
      d1.prepare("SELECT COUNT(*) AS total, ROUND(AVG(overall_score), 0) AS average_score, MAX(created_at) AS last_response FROM submissions").first<Row>(),
      d1.prepare("SELECT dimension, ROUND(AVG(readiness), 1) AS readiness, ROUND(AVG(priority), 1) AS priority FROM dimension_scores GROUP BY dimension").all<Row>(),
      d1.prepare("SELECT archetype, COUNT(*) AS total FROM submissions GROUP BY archetype").all<Row>(),
      d1.prepare("SELECT themes_json FROM submissions").all<Row>(),
    ]);
    const themeCounts = new Map<string, number>();
    for (const row of themeRows.results) {
      try {
        for (const item of JSON.parse(String(row.themes_json ?? "[]")) as { theme: string; count: number }[]) themeCounts.set(item.theme, (themeCounts.get(item.theme) ?? 0) + item.count);
      } catch { /* ignore malformed legacy values */ }
    }
    const dimensionMap = new Map(byDimension.results.map((row) => [String(row.dimension), row]));
    const archetypeMap = new Map(byArchetype.results.map((row) => [String(row.archetype), Number(row.total)]));
    return Response.json({
      total: Number(summary?.total ?? 0), averageScore: Number(summary?.average_score ?? 0), lastResponse: summary?.last_response ?? null,
      dimensions: dimensions.map((item) => ({ ...item, readiness: Number(dimensionMap.get(item.id)?.readiness ?? 0), priority: Number(dimensionMap.get(item.id)?.priority ?? 0) })),
      archetypes: archetypes.map((item) => ({ ...item, total: archetypeMap.get(item.id) ?? 0 })),
      themes: [...themeCounts.entries()].map(([theme, count]) => ({ theme, count })).sort((a, b) => b.count - a.count).slice(0, 8),
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Indicadores temporariamente indisponíveis." }, { status: 500 });
  }
}
