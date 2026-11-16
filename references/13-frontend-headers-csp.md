# Frontend: headers de segurança, CSP, XSS e proteção contra cópia

## Headers de segurança

Verdade primeiro: configurar headers de resposta é o controle de maior retorno
sobre esforço, porque impõe regras ao navegador sem precisar mexer no código da
aplicação. A ausência deles é a falha OWASP de configuração de segurança.

Na Vercel, os headers vão no bloco `headers` do `vercel.json`. O arquivo
`assets/vercel-headers.json` traz o bloco pronto. Os obrigatórios:

| Header | Valor | Defende contra |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | downgrade de HTTPS |
| `Content-Security-Policy` | ver abaixo | XSS e injeção |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | vazamento de referrer |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | abuso de permissões |
| `X-Frame-Options` | `DENY` (ou `frame-ancestors 'none'` na CSP) | clickjacking |

Checagem: leia o `vercel.json`. Cada header ausente é um achado MÉDIO. Depois do
deploy, valide de verdade contra a URL pública (ver varreduras), porque o que vale
é o header que chega no navegador, não o que está no arquivo.

## Content Security Policy

A CSP merece atenção própria porque é a defesa mais forte contra XSS e a mais fácil
de configurar errado. Uma CSP que libera `'unsafe-inline'` em `script-src` não vale
quase nada. Mire em:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://res.cloudinary.com;
connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com;
frame-ancestors 'none';
base-uri 'self';
object-src 'none';
upgrade-insecure-requests;
```

Ajuste `connect-src` e `img-src` aos domínios que o app realmente usa (Firebase,
Cloudinary, Cakto, Gemini). Comece em modo `Content-Security-Policy-Report-Only`
para não quebrar o site, observe o que seria bloqueado, ajuste, e só então mude para
o modo de bloqueio.

## XSS e sanitização

A causa de XSS é exibir conteúdo do usuário sem tratar. Procure:

- Uso de `innerHTML`, `insertAdjacentHTML` ou `document.write` com dados que vêm do
  usuário (nome, bio, link, descrição). Gravidade ALTO. Corrija usando
  `textContent` para texto puro, ou DOMPurify quando precisa permitir HTML.
- Campos de link e rede social sem validar o esquema. Bloqueie `javascript:` e
  outros esquemas perigosos; aceite só `http:` e `https:`.
- Interpolação de dados do usuário direto em templates.

A CSP é uma segunda camada, não substitui a sanitização. As duas juntas.

## Proteção contra cópia e clonagem do site

O usuário se preocupa com cópias. Seja honesto sobre o limite técnico: tudo que
roda no navegador pode ser copiado. Não existe bloqueio total. O que dá para fazer é
encarecer, detectar e proteger juridicamente.

- Mantenha a lógica de valor no backend (Apps Script, funções). O que está no
  servidor não é copiável. Quanto mais valor no servidor, menos útil copiar o
  frontend.
- Minifique e ofusque o JavaScript de produção. Para projetos com build, use um
  ofuscador (javascript-obfuscator) aplicado só nos arquivos finais de saída
  (`dist/`), nunca no código-fonte, senão quebra as importações. Mantenha
  `sourcemap: false` em produção. Para projeto de JS plano sem build, ao menos
  minifique. Gravidade BAIXO, é elevação de custo do ataque, não garantia.
- Marca registrada e direito autoral. Registre a marca no INPI e mantenha aviso de
  copyright. Isso dá base para derrubar cópias.
- Detecção de clones: alertas de busca pelo seu texto e ferramentas como Copyscape.
- Marca d'água nas imagens (o Cloudinary faz) para provar autoria.
- Processo de DMCA pronto para pedir remoção a hospedagem e buscadores.
- Ativos premium (modelos, presets, imagens de demonstração) atrás de login.

## Saída

Registre headers ausentes, CSP fraca, pontos de XSS e o estado da proteção de IP.
O reteste dos headers e da CSP é contra a URL publicada, não contra o arquivo.
