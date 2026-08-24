import type { DimensionId } from "./questionnaire";
export type Answer = { dimension: DimensionId; answer: string; readiness: number; priority: number };
const themeRules: Record<string, string[]> = {
  "Talento e competências": ["talento", "técnic", "formação", "recrut", "candidato", "curso", "escola", "ipl", "esad"],
  "Licenciamento e regulação": ["licen", "regula", "processo", "prazo", "burocra", "autoriza", "câmara", "municip"],
  "Infraestruturas e espaços": ["terreno", "infraestrutura", "energia", "instala", "espaço", "zona industrial", "fibra"],
  "Mobilidade e acessibilidade": ["mobilidade", "transporte", "estacionamento", "acesso", "rodovia", "comboio", "pedonal"],
  "Habitação e qualidade de vida": ["habitação", "casa", "renda", "escola", "saúde", "qualidade de vida", "expatri"],
  "Promoção e posicionamento": ["marca", "promoção", "divulgação", "internacional", "turista", "imagem", "storytelling"],
  "Acompanhamento ao investidor": ["contacto", "interlocutor", "acolhimento", "apoio", "softlanding", "informação", "mentor"],
  "Digitalização": ["digital", "automat", "plataforma", "online", "dados", "conectividade"],
};
export function analyzeAnswers(answers: Answer[]) {
  const normalized = answers.map((item) => item.answer.toLocaleLowerCase("pt-PT")).join(" ");
  const themes = Object.entries(themeRules).map(([theme, terms]) => ({ theme, count: terms.reduce((sum, term) => sum + (normalized.match(new RegExp(term, "g"))?.length ?? 0), 0) })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count).slice(0, 5);
  const average = answers.reduce((sum, item) => sum + item.readiness, 0) / Math.max(answers.length, 1);
  const score = Math.round(average * 20);
  const band = score >= 80 ? "Consolidado" : score >= 60 ? "Em desenvolvimento" : score >= 40 ? "Em estruturação" : "Prioridade crítica";
  return { themes, score, band };
}
