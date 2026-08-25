import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/", extraHeaders = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html", ...extraHeaders } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Ready to Invest landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Caldas Ready to Invest/i);
  assert.match(html, /Antes de construir o Kit/i);
  assert.match(html, /Participar na auscultação/i);
  assert.match(html, /Piloto demonstrador/i);
  assert.match(html, /Acesso reservado/i);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/i);
});

test("contains the adaptive questionnaire and D1-backed routes", async () => {
  const [form, responses, dashboard, hosting, packageJson] = await Promise.all([
    readFile(new URL("../app/questionario/SurveyForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/responses/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/dashboard/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(form, /questions\[profile\.archetype\]/);
  assert.match(form, /consent/);
  assert.match(responses, /INSERT INTO submissions/);
  assert.match(dashboard, /AVG\(readiness\)/);
  assert.equal(JSON.parse(hosting).d1, "DB");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});

test("contains a protected response repository and CSV export", async () => {
  const [adminPage, adminClient, adminApi, exportApi, auth] = await Promise.all([
    readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/AdminClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/api/responses/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/api/export/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/admin-auth.ts", import.meta.url), "utf8"),
  ]);
  assert.match(adminPage, /Área reservada/);
  assert.match(adminClient, /Exportar CSV/);
  assert.match(adminClient, /credentials: "same-origin"/);
  assert.match(adminApi, /getAdminIdentity/);
  assert.match(exportApi, /Content-Disposition/);
  assert.match(auth, /cf-access-authenticated-user-email/);
  assert.match(auth, /cf-access-jwt-assertion/);
  assert.doesNotMatch(auth, /nlaboreiro@mac\.com|miguel\.trindade\.silvestre@gmail\.com/);
});

test("server-renders the reserved dashboard in local development", async () => {
  const response = await render("/admin", { "cf-access-authenticated-user-email": "admin@example.test", "cf-access-jwt-assertion": "verified-test-assertion" });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Área reservada/i);
  assert.match(html, /Auscultação em detalhe/i);
  assert.match(html, /Exportar CSV/i);
});
