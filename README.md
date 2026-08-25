# Caldas Ready to Invest

Plataforma de auscultação ao ecossistema económico para o Kit do Investidor das Caldas da Rainha.

## Plataforma pública

- Domínio oficial: <https://caldasreadytoinvest.pt/>
- Questionário: <https://caldasreadytoinvest.pt/questionario/>
- Indicadores: <https://caldasreadytoinvest.pt/resultados/>

O endereço GitHub Pages mantém-se temporariamente como ponto de encaminhamento durante a transição do domínio.

## Objetivo

Recolher contributos de empresas e instituições, identificar obstáculos e prioridades e apoiar a construção de um diagnóstico comum sobre a capacidade do território para acolher investimento.

O questionário adapta-se a seis perfis de organização e cobre cinco dimensões: ponto de contacto, ecossistema, talento, softlanding e sinal de confiança.

## Tratamento dos dados

As submissões alimentam automaticamente indicadores agregados sobre preparação, prioridade de intervenção, diversidade da amostra e temas recorrentes. Os dados de contacto destinam-se apenas à validação técnica e ao eventual aprofundamento dos contributos.

## Desenvolvimento local

Requer Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

## Publicação autónoma

A aplicação e a base de dados D1 são publicadas na conta Cloudflare do projeto:

```bash
npm run db:migrate:remote
npm run deploy
```

Atualizado em 25 de agosto de 2026.
