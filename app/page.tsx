const dimensions = [
  ["01", "Ponto de contacto", "Como começou a relação com Caldas da Rainha?"],
  ["02", "Ecossistema", "Que decisões, infraestruturas ou serviços criam fricção?"],
  ["03", "Talento", "Onde se encontra — e perde — o talento necessário?"],
  ["04", "Softlanding", "O que teria simplificado os primeiros 90 dias?"],
  ["05", "Sinal", "Que compromisso tornaria Caldas mais convincente?"],
];

const stages = [
  ["01", "Diagnóstico", "Base de trabalho", "done"],
  ["02", "Auscultação", "Fase em curso", "current"],
  ["03", "Validação municipal", "Próximo passo", "future"],
  ["04", "Desenho do Kit", "Fase futura", "future"],
  ["05", "Implementação", "Fase futura", "future"],
];

export const metadata = {
  title: "Caldas Ready to Invest",
  description: "Diagnóstico e auscultação para a futura implementação do Kit do Investidor das Caldas da Rainha.",
};

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Caldas Ready to Invest">
          <span className="brand-mark logo-mark" aria-hidden="true" />
          <span><b>CALDAS</b><small>READY TO INVEST</small></span>
        </a>
        <nav className="top-meta" aria-label="Navegação principal">
          <a href="#processo">Processo</a>
          <a href="/resultados">Resultados</a>
          <a href="https://espacos.caldasreadytoinvest.pt">Piloto Espaços</a>
          <a href="/admin">Acesso reservado</a>
          <span className="phase-status"><i /> Fase de auscultação</span>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="eyebrow">FASE 01 · DIAGNÓSTICO E AUSCULTAÇÃO · 2026</div>
        <h1>Antes de construir o Kit,<br /><em>ouvimos quem investe.</em></h1>
        <p className="hero-copy">Esta plataforma é uma etapa preparatória do futuro Kit do Investidor das Caldas da Rainha. Recolhe experiência real, identifica obstáculos e ajuda a definir prioridades antes do desenho e da implementação do projeto.</p>
        <div className="hero-actions">
          <a className="primary" href="/questionario">Participar na auscultação <span>→</span></a>
          <span className="duration"><b>10–12 min.</b><small>Respostas tratadas de forma agregada</small></span>
        </div>
        <div className="hero-rule"><span>05 dimensões</span><span>06 perfis de organização</span><span>01 diagnóstico partilhado</span></div>
      </section>

      <section className="process" id="processo">
        <div className="process-intro">
          <span className="section-kicker">PERCURSO DO PROJETO</span>
          <h2>Decidir com evidência.<br />Implementar com confiança.</h2>
          <p>O questionário não é o Kit do Investidor. É o instrumento de auscultação que antecede a validação municipal, o desenho da solução e a sua futura implementação.</p>
        </div>
        <div className="timeline">
          {stages.map(([n, title, status, state]) => (
            <article className={state} key={n}>
              <span>{n}</span>
              <div><h3>{title}</h3><p>{status}</p></div>
              <i aria-hidden="true" />
            </article>
          ))}
        </div>
        <p className="process-note"><b>Estado atual</b> — diagnóstico em consolidação e auscultação ao ecossistema económico.</p>
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

      <section className="pilot-card">
        <div className="pilot-copy">
          <span className="section-kicker light">PILOTO DEMONSTRADOR</span>
          <h2>CaldasEspaços testa uma capacidade futura.</h2>
          <p>Um protótipo com oferta imobiliária real que demonstra como o futuro Kit poderá organizar informação territorial útil para investidores. Não corresponde ainda a uma funcionalidade municipal implementada.</p>
          <a href="https://espacos.caldasreadytoinvest.pt">Explorar o piloto <span>→</span></a>
        </div>
        <div className="pilot-metrics" aria-label="Indicadores do piloto">
          <span><b>51</b><small>ofertas verificadas</small></span>
          <span><b>03</b><small>tipologias principais</small></span>
          <span><b>04</b><small>fontes identificadas</small></span>
        </div>
      </section>

      <section className="start-card">
        <div><span className="section-kicker light">AUSCULTAÇÃO EM CURSO</span><h2>A sua experiência conta.</h2><p>Começamos pelo perfil da organização e adaptamos as perguntas à sua realidade.</p></div>
        <a className="start-cta" href="/questionario">Iniciar participação <span>→</span></a>
      </section>

      <footer><span>Caldas Ready to Invest · Projeto em preparação</span><span>Diagnóstico e auscultação para o futuro Kit do Investidor</span><a href="/admin">Área reservada</a></footer>
    </main>
  );
}
