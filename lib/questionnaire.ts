export const dimensions = [
  { id: "contacto", short: "Contacto", title: "Ponto de contacto", description: "Descoberta, primeira abordagem e capacidade de resposta." },
  { id: "ecossistema", short: "Ecossistema", title: "Ecossistema", description: "Infraestruturas, regulação, serviços e redes locais." },
  { id: "talento", short: "Talento", title: "Talento", description: "Recrutamento, formação, retenção e qualidade de vida." },
  { id: "softlanding", short: "Softlanding", title: "Softlanding", description: "Instalação, acompanhamento e primeiros 90 dias." },
  { id: "sinal", short: "Sinal", title: "Sinal de confiança", description: "Compromissos públicos e argumentos para investir." },
] as const;

export type DimensionId = (typeof dimensions)[number]["id"];
export const archetypes = [
  { id: "A", name: "IDE industrial", description: "Operação industrial com capital ou casa-mãe internacional" },
  { id: "B", name: "Gazela / PME jovem", description: "Empresa jovem, empreendedor ou negócio em crescimento rápido" },
  { id: "C", name: "Âncora industrial nacional", description: "Empresa industrial portuguesa consolidada" },
  { id: "D", name: "Tech scale-up", description: "Tecnologia com capital internacional e crescimento acelerado" },
  { id: "E", name: "Retalho e comércio", description: "Comércio, serviços ou negócio de proximidade" },
  { id: "F", name: "Voz institucional", description: "Município, associação, ensino ou entidade de apoio" },
] as const;
type Question = { question: string; followUp: string };

export const questions: Record<string, Record<DimensionId, Question>> = {
  A: {
    contacto: { question: "Como apareceu Caldas no radar quando a casa-mãe procurou uma localização?", followUp: "Que outras cidades estavam na shortlist e o que fez a diferença?" },
    ecossistema: { question: "Que decisões de infraestrutura ou regulatórias custaram mais tempo do que esperavam?", followUp: "Quais se resolveriam hoje em 14 dias com o interlocutor certo?" },
    talento: { question: "De onde vêm hoje os técnicos e quadros da operação?", followUp: "Que competência é mais difícil de encontrar num raio de 30 km?" },
    softlanding: { question: "Nos primeiros 90 dias tiveram um ponto único de contacto?", followUp: "Que três apoios municipais teriam feito maior diferença?" },
    sinal: { question: "Se a casa-mãe comparasse amanhã a operação com outras localizações europeias, o que a manteria aqui?", followUp: "Que argumento não deixariam sair da sala?" },
  },
  B: {
    contacto: { question: "Porque começaram em Caldas e não noutro lugar?", followUp: "No dia da decisão, alguém na administração local sabia que existiam?" },
    ecossistema: { question: "Qual foi a primeira porta a que bateram para pedir apoio e o que aconteceu?", followUp: "O que pediram e nunca conseguiram?" },
    talento: { question: "Como constroem equipa quando ainda não têm uma marca empregadora forte?", followUp: "Onde perdem candidatos para Lisboa ou Leiria?" },
    softlanding: { question: "Que decisão dos primeiros 12 meses gostariam de reverter?", followUp: "O que a teria evitado: informação, mentor ou contacto?" },
    sinal: { question: "O que diriam a um empreendedor a ponderar Caldas em vez de Lisboa?", followUp: "Que mito sobre Caldas gostariam de eliminar?" },
  },
  C: {
    contacto: { question: "Se começassem hoje do zero, nasceriam ainda em Caldas?", followUp: "O que mudou nos últimos 10 anos, para melhor e para pior?" },
    ecossistema: { question: "Que infraestrutura ou serviço público está aquém do vosso crescimento?", followUp: "O que tem de ser resolvido nos próximos cinco anos?" },
    talento: { question: "Onde recrutam os quadros técnicos e onde os perdem?", followUp: "Que curso ou centro de formação devia existir e ainda não existe?" },
    softlanding: { question: "Quando recebem clientes ou fornecedores estrangeiros, o que lhes falta encontrar na cidade?", followUp: "Com que impressão saem?" },
    sinal: { question: "O que responderiam a um CEO europeu que ponderasse mudar operações para Caldas?", followUp: "Que garantia lhe daria conforto para decidir?" },
  },
  D: {
    contacto: { question: "Quantos dos vossos investidores internacionais já visitaram Caldas?", followUp: "O que demoraram a compreender sobre uma localização não-capital?" },
    ecossistema: { question: "Que decisão de política pública seria transformadora para o setor?", followUp: "Onde está o maior gargalo físico: energia, conectividade ou terreno?" },
    talento: { question: "Que serviços urbanos falham hoje para talento nacional ou expatriado?", followUp: "Que três melhorias atrairiam mais talento internacional?" },
    softlanding: { question: "Nos próximos 24 meses, o que pode o Município fazer para não perder a expansão?", followUp: "Se tivessem de sair, para onde iriam e porquê?" },
    sinal: { question: "Recomendariam Caldas a outros CEO de scale-ups?", followUp: "Que promessa pública gostariam que a cidade fizesse?" },
  },
  E: {
    contacto: { question: "Como chegou a Caldas o cliente ou turista que hoje entra no vosso negócio?", followUp: "Voltaria à cidade se não fosse por vocês?" },
    ecossistema: { question: "Que ferramenta, infraestrutura ou serviço local funciona — e qual não funciona?", followUp: "Estacionamento, sinalética ou fluxo pedonal: o que resolver primeiro?" },
    talento: { question: "É fácil contratar hoje um profissional qualificado ou bilingue?", followUp: "Que formação teria impacto imediato na equipa?" },
    softlanding: { question: "Se um novo empresário abrisse amanhã, o que devia ser automatizado nos primeiros 30 dias?", followUp: "O que continuam hoje a tentar resolver com o Município?" },
    sinal: { question: "Caldas pode ser uma localização-piloto para novas marcas e conceitos?", followUp: "O que convenceria um investidor a comprometer-se por cinco anos?" },
  },
  F: {
    contacto: { question: "Nos últimos 12 meses, que investidor perdemos — ou ganhámos — e porquê?", followUp: "Que outra cidade estava a competir?" },
    ecossistema: { question: "Qual é a decisão infraestrutural mais atrasada que impede fechar um investimento?", followUp: "Que decisão política podia acontecer em três meses?" },
    talento: { question: "Onde está a oferta formativa mais desalinhada da procura?", followUp: "Que curso devia abrir no próximo ano letivo?" },
    softlanding: { question: "Recebe um email de um investidor: o que acontece do minuto 1 ao dia 14?", followUp: "Onde está o ponto de descontinuidade que mais falha?" },
    sinal: { question: "Que promessa pública e mensurável pode Caldas fazer a investidores?", followUp: "Como será medida nos próximos 12 meses?" },
  },
};
