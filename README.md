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

## Área reservada (`/admin`) — configuração obrigatória

O acesso à área reservada é verificado com o token JWT do Cloudflare Access (assinatura, audiência, emissor e validade). Sem esta configuração, o acesso é sempre recusado.

1. No Cloudflare Zero Trust, criar uma aplicação Access para `caldasreadytoinvest.pt/admin*` com a política de emails autorizados.
2. Copiar o *team domain* (ex.: `equipa.cloudflareaccess.com`) e a *Application Audience (AUD) Tag* da aplicação.
3. Definir as variáveis no Worker:

```bash
npx wrangler secret put CF_ACCESS_TEAM_DOMAIN
npx wrangler secret put CF_ACCESS_AUD
npx wrangler secret put ADMIN_EMAILS   # opcional: emails autorizados, separados por vírgulas
```

Em desenvolvimento local, definir `ADMIN_DEV_BYPASS=true` em `.dev.vars` (nunca em produção).

O URL `*.workers.dev` está desativado (`workers_dev: false`) para que a aplicação só seja acessível pelo domínio protegido pelo Access.
