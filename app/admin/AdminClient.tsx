"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminSubmission } from "../../lib/admin-data";

type ApiResponse = { submissions?: AdminSubmission[]; error?: string };

const archetypeOptions = [
  ["A", "IDE industrial"], ["B", "Gazela / PME jovem"], ["C", "Âncora industrial nacional"],
  ["D", "Tech scale-up"], ["E", "Retalho e comércio"], ["F", "Voz institucional"],
];

function formatDate(value: string, withTime = false) {
  return new Intl.DateTimeFormat("pt-PT", withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(new Date(value));
}

export default function AdminClient() {
  const [items, setItems] = useState<AdminSubmission[]>([]);
  const [query, setQuery] = useState("");
  const [archetype, setArchetype] = useState("Todos");
  const [selected, setSelected] = useState<AdminSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/admin/api/responses", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as ApiResponse;
        if (!response.ok) throw new Error(data.error ?? "Não foi possível consultar as respostas.");
        setItems(data.submissions ?? []);
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pt");
    return items.filter((item) => {
      const searchable = `${item.respondentName} ${item.respondentEmail} ${item.organization} ${item.role}`.toLocaleLowerCase("pt");
      return (!needle || searchable.includes(needle)) && (archetype === "Todos" || item.archetype === archetype);
    });
  }, [items, query, archetype]);

  const average = items.length ? Math.round(items.reduce((sum, item) => sum + item.overallScore, 0) / items.length) : 0;
  const represented = new Set(items.map((item) => item.archetype)).size;
  const lastResponse = items[0]?.createdAt;

  return (
    <section className="admin-body">
      <div className="admin-title">
        <div><span className="section-kicker">REPOSITÓRIO DE RESPOSTAS</span><h1>Auscultação em detalhe.</h1><p>Consulta reservada dos participantes e dos contributos submetidos.</p></div>
        <a className="admin-export" href="/admin/api/export">Exportar CSV <span>↓</span></a>
      </div>

      <div className="admin-metrics">
        <article><span>Respostas</span><strong>{items.length}</strong><small>submissões registadas</small></article>
        <article><span>Índice médio</span><strong>{items.length ? average : "—"}<i>{items.length ? "/100" : ""}</i></strong><small>preparação agregada</small></article>
        <article><span>Perfis</span><strong>{represented}<i>/6</i></strong><small>perfis representados</small></article>
        <article><span>Última resposta</span><strong className="date-metric">{lastResponse ? formatDate(lastResponse) : "—"}</strong><small>atualização automática</small></article>
      </div>

      <div className="admin-toolbar">
        <label><span>Pesquisar</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome, organização ou email…" /></label>
        <label><span>Perfil</span><select value={archetype} onChange={(event) => setArchetype(event.target.value)}><option>Todos</option>{archetypeOptions.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
        <p><b>{filtered.length}</b> resultado{filtered.length === 1 ? "" : "s"}</p>
      </div>

      {loading && <div className="admin-state"><i className="loading-line" />A carregar respostas…</div>}
      {error && <div className="admin-state error"><b>Não foi possível abrir os dados.</b><p>{error}</p></div>}
      {!loading && !error && filtered.length === 0 && <div className="admin-state"><b>Sem respostas com estes critérios.</b><p>Altere a pesquisa ou o perfil selecionado.</p></div>}

      {!loading && !error && filtered.length > 0 && <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>Data</th><th>Participante</th><th>Organização</th><th>Perfil</th><th>Índice</th><th><span className="sr-only">Abrir</span></th></tr></thead>
        <tbody>{filtered.map((item) => <tr key={item.id}>
          <td><time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></td>
          <td><b>{item.respondentName}</b><small>{item.respondentEmail}</small></td>
          <td><b>{item.organization}</b><small>{item.role || "Função não indicada"}</small></td>
          <td><span className="profile-chip">{item.archetype}</span>{item.archetypeName}</td>
          <td><strong>{item.overallScore}<i>/100</i></strong><small>{item.maturityBand}</small></td>
          <td><button onClick={() => setSelected(item)} aria-label={`Abrir resposta de ${item.respondentName}`}>Ver resposta <span>→</span></button></td>
        </tr>)}</tbody>
      </table></div>}

      <p className="admin-privacy">Dados reservados. Use os contactos apenas para validação técnica ou aprofundamento autorizado dos contributos.</p>

      {selected && <div className="admin-overlay" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}>
        <aside className="admin-detail" role="dialog" aria-modal="true" aria-labelledby="admin-detail-title">
          <button className="admin-close" onClick={() => setSelected(null)} aria-label="Fechar detalhe">×</button>
          <span className="section-kicker">RESPOSTA INDIVIDUAL · {selected.archetype}</span>
          <h2 id="admin-detail-title">{selected.respondentName}</h2>
          <div className="respondent-card"><p><span>Organização</span><b>{selected.organization}</b></p><p><span>Função</span><b>{selected.role || "Não indicada"}</b></p><p><span>Email</span><a href={`mailto:${selected.respondentEmail}`}>{selected.respondentEmail}</a></p><p><span>Submissão</span><b>{formatDate(selected.createdAt, true)}</b></p></div>
          <div className="detail-score"><strong>{selected.overallScore}<i>/100</i></strong><span>{selected.maturityBand}<small>{selected.archetypeName}</small></span></div>
          <div className="answer-list">{selected.answers.map((answer, index) => <article key={answer.dimension}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><small>{answer.dimension}</small><h3>{answer.question ?? "Contributo"}</h3><p>{answer.answer}</p><div className="answer-scores"><b>Preparação {answer.readiness}/5</b><b>Prioridade {answer.priority}/5</b></div></div>
          </article>)}</div>
        </aside>
      </div>}
    </section>
  );
}
