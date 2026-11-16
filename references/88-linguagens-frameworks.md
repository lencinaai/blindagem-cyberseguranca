# Linguagens e frameworks

Cada linguagem e framework tem defesas próprias e armadilhas próprias. Depois de
detectar a stack, aplique a mitigação específica, sem tratar uso legítimo como falha
(ver `references/02-anti-falso-positivo.md`).

## Frontend (React, Vue, Angular, Svelte)

- Auto-escapam a saída por padrão. Interpolar texto não é XSS. O risco está no
  bypass: `dangerouslySetInnerHTML`, `v-html`, `[innerHTML]`, `bypassSecurityTrust`.
  Revise só esses pontos e componentes de terceiros.

## Node, Express, Nest

- Ordem do middleware importa: autenticação e autorização antes da rota.
- Para webhook, leia o corpo cru antes de o parser JSON consumir, senão a verificação
  quebra. Cuidado com poluição de protótipo (`__proto__` em objeto do cliente) e com
  confiança cega em proxy (`trust proxy`).

## Python (Django, Flask, FastAPI)

- Django tem CSRF e ORM seguros por padrão; não os desligue. Valide `ALLOWED_HOSTS`.
  Cuidado com template com `|safe`, com desserialização (pickle) e com `subprocess`
  usando entrada do usuário.

## Outras (Go, Java, .NET, PHP, Rust)

- Use as defesas do framework: query parametrizada, template com escape, e a
  biblioteca de criptografia padrão. Evite os padrões perigosos da linguagem:
  desserialização insegura, path traversal, execução de comando, e criptografia
  caseira. Cada ecossistema tem seu SAST e seu gerenciador de dependência.

## Como usar

Depois de detectar a linguagem e o framework, procure os pontos perigosos específicos
acima, e confirme que as defesas padrão do framework estão ligadas. O SAST
(`references/70-ferramentas-varredura.md`) ajuda a localizar os sinks.

## Saída

Liste os bypasses de escape, middleware fora de ordem, defesas de framework
desligadas, e padrões perigosos da linguagem encontrados.
