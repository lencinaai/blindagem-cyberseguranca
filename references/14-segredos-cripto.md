# Segredos, chaves, TLS e dependências

A falha clássica de app feito com IA: uma chave secreta no frontend, no Git ou em
log. O atacante usa sua chave Gemini, sua conta Cloudinary ou sua credencial de
admin do Firebase e drena o orçamento ou vaza os dados.

## Segredos e chaves

- CRÍTICO: segredo no código do navegador ou em arquivo versionado. Procure padrões
  de chave no projeto inteiro: `AIza` (Google/Gemini), `sk_live` e `pk_live`
  (pagamentos), `-----BEGIN PRIVATE KEY-----` (service account), `service_account`,
  `client_secret`, `api_secret`. Comandos em `references/70-ferramentas-varredura.md`.
- O que pode ficar no frontend, e não é falha: a config pública do Firebase (`apiKey`
  do cliente), a chave publicável da Stripe, a chave anônima do Supabase. São
  públicas por design. Não confunda com segredo (ver
  `references/02-anti-falso-positivo.md`).
- O que nunca pode: chave do Gemini, secret do webhook Cakto, service account do
  Firebase, API secret do Cloudinary. Tudo só no servidor: variáveis de ambiente da
  Vercel, ou Script Properties e Secret Manager no Apps Script.
- Variável de ambiente exposta ao cliente (prefixo público do framework) é tratada
  como pública. Só o que fica no servidor é segredo de verdade.
- Se um segredo já vazou, a correção principal é o usuário rotacionar a chave. Apagar
  o commit não resolve, o histórico permanece. Marque como ação urgente.
- Restrinja cada chave ao mínimo: domínio (referrer), IP, APIs habilitadas, escopo.
- `.gitignore` é apoio, não prova. Um `.env` já commitado significa segredo
  comprometido, mesmo depois de removido do arquivo atual.

## Criptografia

- Em trânsito: HTTPS em tudo, com TLS atual. Na Vercel e na Cloudflare o HTTPS é
  automático e moderno. A checagem é garantir que não há conteúdo carregado por HTTP
  dentro de página HTTPS (mixed content), e confirmar a nota em SSL Labs. Confirme,
  não presuma.
- Em repouso: o Firestore cifra em repouso por padrão. Para dado sensível fora dele,
  use criptografia do provedor de storage, com a chave separada do dado.
- Senhas: se você guarda senha (fora do Firebase Auth, que já cuida disso), use um
  algoritmo próprio para senha, como Argon2id ou bcrypt com custo adequado, com sal
  individual, mais um pepper guardado no servidor. Nunca MD5, SHA1 ou SHA256 puro
  para senha, que são rápidos demais e caem em ataque de tabela pré-computada.
- Não invente criptografia própria. Use bibliotecas estabelecidas.

## Dependências e cadeia de suprimentos

- Rode a varredura de dependências (comandos em `references/70-ferramentas-varredura.md`)
  e corrija o que for explorável, sempre retestando que o app ainda funciona.
- Ative o Dependabot no GitHub para alertas e atualização.
- Minimize dependências; cada pacote é superfície de ataque. Token maxing e excesso
  de código geram mais dependências e mais vulnerabilidades.
- Para risco maior, Snyk ou Socket.dev detectam pacote malicioso, não só vulnerável.
- Sem Git, você perde Dependabot, varredura de segredos no histórico e
  rastreabilidade. Recomende iniciar um repositório privado. Isso sozinho destrava
  várias defesas automáticas e gratuitas. Gravidade MÉDIO.

## Saída

Liste segredos expostos (CRÍTICO, com rotação), estado do TLS, tratamento de senha,
e dependências vulneráveis. As restrições de chave e o Dependabot entram como
pendências.
