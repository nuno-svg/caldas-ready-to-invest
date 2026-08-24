const dimensions = [
  ["01", "Ponto de contacto", "Como começou a relação com Caldas da Rainha?"],
  ["02", "Ecossistema", "Que decisões, infraestruturas ou serviços criam fricção?"],
  ["03", "Talento", "Onde se encontra — e perde — o talento necessário?"],
  ["04", "Softlanding", "O que teria simplificado os primeiros 90 dias?"],
  ["05", "Sinal", "Que compromisso tornaria Caldas mais convincente?"],
];

export const metadata = {
  title: "Caldas Ready to Invest",
  description: "Auscultação ao ecossistema económico das Caldas da Rainha.",
};

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Caldas Ready to Invest">
          <span className="brand-mark">CR</span>
          <span><b>CALDAS</b><small>READY TO INVEST</small></span>
        </a>
        <div className="top-meta"><a href="/resultados">Indicadores</a><span>Kit do Investidor</span><span className="live-dot" />Auscultação ativa</div>
      </header>

      <section className="hero" id="inicio">
        <div className="eyebrow">INTELIGÊNCIA TERRITORIAL · 2026</div>
        <h1>A experiência de quem investe<br />ajuda a cidade a <em>decidir melhor.</em></h1>
        <p className="hero-copy">Um questionário dirigido a empresas e instituições para identificar obstáculos, prioridades e sinais concretos que tornem as Caldas da Rainha mais preparadas para receber investimento.</p>
        <div className="hero-actions">
          <a className="primary" href="/questionario">Responder ao questionário <span>→</span></a>
          <span className="duration"><b>10–12 min.</b><small>Respostas tratadas de forma agregada</small></span>
        </div>
        <div className="hero-rule"><span>05 dimensões</span><span>06 perfis de organização</span><span>01 diagnóstico comum</span></div>
      </section>

      <section className="framework" id="questionario">
        <div className="section-intro">
          <span className="section-kicker">QUADRO DE AUSCULTAÇÃO</span>
          <h2>Cinco dimensões.<br />Uma visão comparável.</h2>
          <p>As perguntas adaptam-se ao perfil da organização, mantendo uma base comum que permite comparar padrões e prioridades.</p>
        </div>
        <div className="dimension-list">
          {dimensions.map(([n, title, copy]) => (
            <article className="dimension" key={n}>
              <span>{n}</span><div><h3>{title}</h3><p>{copy}</p></div><b>↗</b>
            </article>
          ))}
        </div>
      </section>

      <section className="start-card">
        <div><span className="section-kicker light">QUESTIONÁRIO ADAPTATIVO</span><h2>Começamos pelo seu perfil.</h2><p>A sequência de perguntas será ajustada à realidade da sua organização.</p></div>
        <a className="start-cta" href="/questionario">Iniciar resposta <span>→</span></a>
      </section>

      <footer><span>Município das Caldas da Rainha</span><span>Kit do Investidor · Auscultação ao ecossistema económico</span></footer>
    </main>
  );
}
