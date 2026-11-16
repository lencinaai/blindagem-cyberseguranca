# Varreduras e ferramentas: comandos executáveis (2026)

Catálogo das varreduras da Fase 1, com comandos atuais. O ambiente alvo é Windows
com Node, npm, Python, git e Firebase CLI. Prefira ferramentas via `npx` ou binário
único para não exigir instalação global. Rode cada varredura, colete a saída e
transforme cada problema em um achado do catálogo, passando pelo filtro anti falso
positivo (`references/02-anti-falso-positivo.md`).

Já instalado e pronto neste desk: `gitleaks` (segredos) e `osv-scanner` (dependências),
como binários no PATH via winget. `npm audit` e o Firebase CLI já existem. Semgrep não
roda nativo no Windows (ver seção 3). TruffleHog e Nuclei não estão instalados; entram
só se o usuário quiser aprofundar.

Regra de segurança do processo: nenhum script do projeto é executado na descoberta.
Estas ferramentas leem o código e as dependências; a varredura dinâmica (DAST) só
roda contra ambiente autorizado.

## 1. Segredos expostos no código e no histórico

Stack recomendado: Gitleaks no dia a dia, TruffleHog para confirmar segredo vivo.

```bash
# Gitleaks: rapido, sem rede, +150 padroes. --redact esconde o segredo no log.
gitleaks detect --redact

# TruffleHog: --only-verified falha so em segredo confirmado vivo, reduz falso positivo.
trufflehog git file://. --since-commit HEAD~1 --only-verified --fail
```

Busca rápida por padrões, se preferir a ferramenta Grep do agente:
`AIza[0-9A-Za-z_-]{30,}`, `sk_live_[0-9A-Za-z]+`, `pk_live_`, `api_secret`,
`client_secret`, `-----BEGIN (RSA |EC )?PRIVATE KEY-----`, `service_account`.

Qualquer segredo de servidor no frontend ou no Git é CRÍTICO, e a ação principal é o
usuário rotacionar a chave. `.gitignore` é apoio, não prova.

## 2. Dependências vulneráveis (SCA)

```bash
npm audit --omit=dev

# OSV-Scanner v2 (Google), cobre mais ecossistemas que o npm audit.
osv-scanner scan --recursive .
```

Não fixe em `@latest` em CI de garantia, e não use o fix guiado em projeto que você
não confia. Trate CVE explorável como ALTO. Corrija subindo a versão e retestando
que o app funciona.

## 3. Análise estática do código (SAST)

Atenção ao ambiente: o Semgrep não roda nativo no Windows (precisa de WSL ou Docker),
que é o desk deste usuário. Então, neste desk:

- Para JavaScript e TypeScript, use o ESLint com plugin de segurança, que é Node e
  roda nativo no Windows:

```bash
npx eslint-plugin-security   # via config do projeto, plugin security
```

- Se houver WSL ou Docker disponível, aí sim o Semgrep cobre mais num comando:

```bash
semgrep scan --config p/security-audit --config p/secrets --config p/owasp-top-ten \
  --sarif --output semgrep.sarif
```

- Sem SAST automatizado, a leitura de código pelo próprio agente cobre o essencial.
  Procure especialmente: `eval`, `innerHTML` com dado de usuário, concatenação de
  entrada em comando ou query, `Math.random` para token de segurança, e JWT `decode`
  sem verificação.

## 4. Regras do Firestore (teste de isolamento)

Esqueleto de `test-rules.js` com `@firebase/rules-unit-testing`:

```javascript
const { initializeTestEnvironment, assertFails, assertSucceeds } =
  require("@firebase/rules-unit-testing");
const fs = require("fs");

(async () => {
  const env = await initializeTestEnvironment({
    projectId: "demo-teste",
    firestore: { rules: fs.readFileSync("firestore.rules", "utf8") },
  });

  const alice = env.authenticatedContext("alice").firestore();
  const bob = env.authenticatedContext("bob").firestore();
  const anon = env.unauthenticatedContext().firestore();

  await assertFails(bob.doc("usuarios/alice").get());
  await assertFails(alice.doc("usuarios/alice").update({ pro: true }));
  await assertFails(anon.doc("usuarios/alice").get());
  await assertSucceeds(anon.doc("paginas/exemplo").get());

  await env.cleanup();
  console.log("Testes de regras concluidos");
})();
```

```bash
npm install --save-dev @firebase/rules-unit-testing
firebase emulators:exec --only firestore "node test-rules.js"
```

Cada `assertFails` que na verdade tiver sucesso é um vazamento, gravidade CRÍTICO.

## 5. Headers de segurança e CSP (contra a URL publicada)

```powershell
(Invoke-WebRequest -Uri "https://seusite.com" -Method Head).Headers
```

Validação externa (abrir no navegador): securityheaders.com, Mozilla Observatory,
SSL Labs para o TLS. Header obrigatório ausente é MÉDIO; CSP com `'unsafe-inline'` em
`script-src` é MÉDIO a ALTO conforme a página.

## 6. Teste dinâmico (DAST) leve, opcional

Só contra ambiente autorizado (staging próprio), com janela e autorização. Nuclei é
leve (binário único, sem Java, sem Docker obrigatório) e rápido:

```bash
# templates conhecidos: CVEs, exposicoes, misconfig. 5 a 15 minutos.
nuclei -u https://staging.seusite.com

# modo DAST/fuzzing: checagens dinamicas de SQLi, XSS, SSRF, SSTI, CRLF, LFI.
nuclei -u https://staging.seusite.com -dast
```

Para descoberta de endpoints e crawling, o ZAP baseline complementa, se disponível.
Para a maioria dos casos desta stack, as varreduras 1 a 5 já cobrem o essencial; o
DAST entra quando se quer profundidade extra.

## 7. Reteste do webhook da Cakto

A Cakto envia o `secret` no corpo JSON, não em header (ver
`references/20-pagamentos-cakto.md`). O reteste envia o secret errado no corpo:

```powershell
# secret errado no corpo deve responder 401 e nao liberar nada
Invoke-WebRequest -Uri "https://seusite.com/api/webhook" -Method Post `
  -Body '{"secret":"errado","event":"purchase_approved","data":{"id":"x"}}' `
  -ContentType "application/json" -SkipHttpErrorCheck |
  Select-Object StatusCode
```

Esperado: 401. Depois, envie o secret certo com um `data.id` repetido e confirme que
não processa duas vezes (idempotência).

## Ordem de execução sugerida

1. Segredos (1) e dependências (2): rápidas e pegam o mais grave.
2. Regras do Firestore (4): o maior vetor de vazamento.
3. SAST (3) e headers (5).
4. Webhook (7) e, se for o caso, DAST (6).

Colete tudo no catálogo de achados antes de começar a corrigir.
