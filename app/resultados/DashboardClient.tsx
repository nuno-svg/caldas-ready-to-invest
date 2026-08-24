"use client";

import { useEffect, useState } from "react";
type Dashboard = {
  total: number; averageScore: number; lastResponse: string | null;
  dimensions: { id: string; title: string; description: string; readiness: number; priority: number }[];
  archetypes: { id: string; name: string; total: number }[];
  themes: { theme: string; count: number }[];
};

export default function DashboardClient() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/dashboard", { cache: "no-store" }).then(async (response) => { const json = await response.json(); if (!response.ok) throw new Error(json.error); setData(json); }).catch((cause) => setError(cause.message)); }, []);
  if (error) return <section className="dashboard-body"><div className="empty-state"><b>Indicadores indisponíveis</b><p>{error}</p></div></section>;
  if (!data) return <section className="dashboard-body"><div className="loading-line" /></section>;
  const maxTheme = Math.max(...data.themes.map((item) => item.count), 1);
  const maxArchetype = Math.max(...data.archetypes.map((item) => item.total), 1);
  return (
    <section className="dashboard-body">
      <div className="dashboard-title"><div><span className="section-kicker">LEITURA AGREGADA</span><h1>O que o ecossistema está a dizer.</h1></div><div className="updated">Atualização automática<small>{data.lastResponse ? new Date(data.lastResponse).toLocaleString("pt-PT") : "A aguardar a primeira resposta"}</small></div></div>
      <div className="metric-row"><article><span>Respostas válidas</span><strong>{data.total}</strong><small>repositório consolidado</small></article><article><span>Índice de preparação</span><strong>{data.total ? data.averageScore : "—"}<i>{data.total ? "/100" : ""}</i></strong><small>média das cinco dimensões</small></article><article><span>Perfis representados</span><strong>{data.archetypes.filter((item) => item.total > 0).length}<i>/6</i></strong><small>diversidade da amostra</small></article></div>
      {data.total === 0 ? <div className="empty-state"><b>O painel está pronto para receber contributos.</b><p>Os indicadores, temas e comparações surgirão automaticamente após a primeira submissão.</p><a className="primary" href="/questionario">Registar primeira resposta <span>→</span></a></div> : <>
        <div className="dashboard-grid">
          <article className="dashboard-card wide"><div className="card-head"><div><span>PREPARAÇÃO × PRIORIDADE</span><h2>Diagnóstico por dimensão</h2></div><small>Escala 1–5</small></div><div className="dimension-bars">{data.dimensions.map((item) => <div className="bar-row" key={item.id}><div><b>{item.title}</b><small>{item.description}</small></div><div className="dual-bars"><span style={{ width: `${item.readiness * 20}%` }}><i>{item.readiness.toFixed(1)}</i></span><span className="priority-bar" style={{ width: `${item.priority * 20}%` }}><i>{item.priority.toFixed(1)}</i></span></div></div>)}</div><div className="legend"><span className="ready-key">Preparação atual</span><span className="priority-key">Prioridade de intervenção</span></div></article>
          <article className="dashboard-card"><div className="card-head"><div><span>AMOSTRA</span><h2>Perfis participantes</h2></div></div><div className="archetype-bars">{data.archetypes.map((item) => <div key={item.id}><span><b>{item.id}</b>{item.name}<i>{item.total}</i></span><em><i style={{ width: `${(item.total / maxArchetype) * 100}%` }} /></em></div>)}</div></article>
          <article className="dashboard-card"><div className="card-head"><div><span>TEMAS RECORRENTES</span><h2>Sinais nas respostas</h2></div></div><div className="theme-list">{data.themes.length ? data.themes.map((item, index) => <div key={item.theme}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.theme}</b><em style={{ width: `${(item.count / maxTheme) * 100}%` }} /></div>) : <p>Os primeiros temas surgirão à medida que forem recebidas respostas abertas.</p>}</div></article>
        </div>
      </>}
      <p className="dashboard-footnote">Resultados indicativos e agregados. A interpretação técnica deve considerar dimensão, diversidade e composição da amostra.</p>
    </section>
  );
}
