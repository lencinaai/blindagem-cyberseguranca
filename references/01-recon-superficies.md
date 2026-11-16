# Fase 0: Reconhecimento da superfície

Objetivo: antes de varrer, saber exatamente o que existe. Cinco minutos aqui
poupam horas corrigindo o que não importa.

## Detecção de stack

Olhe o projeto e identifique o que se aplica. Sinais práticos:

- `package.json` com dependências revela o ecossistema (Vercel, firebase, etc.).
- Pasta `api/` na raiz com arquivos `.js` indica funções serverless da Vercel.
- `firebase.json`, `firestore.rules`, `firestore.indexes.json` indicam Firebase.
- Chamadas a `firebase`, `firestore`, `getAuth` no frontend indicam Firebase no
  cliente.
- `vercel.json` controla rotas, headers e redirects.
- Referências a `cloudinary` indicam upload e entrega de mídia.
- Webhooks da Cakto costumam estar em uma rota como `api/webhook` ou `api/cakto`.
- Arquivos `.gs` ou menção a `google.script.run` indicam backend em Apps Script.
- Chamadas a `generativelanguage.googleapis.com` ou `gemini` indicam uso de IA.

Anote a lista. Cada item liga a um arquivo de referência de domínio.

## Inventário mínimo de ativos

Mapeie, ainda que em uma lista curta:

- Domínios e onde o DNS é gerenciado (Cloudflare?).
- Frontend: páginas públicas e o painel privado.
- Rotas de API: liste cada arquivo em `api/` e o que cada um faz.
- Webhooks: quais endpoints recebem chamadas de terceiros (Cakto).
- Dados: quais coleções do Firestore existem e o que guardam.
- Segredos: onde deveriam estar (variáveis de ambiente da Vercel, propriedades do
  Apps Script) e onde não podem estar (frontend, Git).
- Integrações: Cakto, Cloudinary, Gemini, e-mail.
- Contas administrativas: Google/Firebase, Vercel, Cloudflare, Cloudinary, Cakto,
  GitHub.

## Classificação de dados

Marque cada tipo de dado em um de quatro níveis, porque cada nível herda critérios
de criptografia, acesso, log e backup:

- Público: conteúdo da página publicada.
- Interno: configuração não sensível.
- Confidencial: dados pessoais de leads e clientes, e-mails, telefones.
- Restrito: credenciais, segredos, chaves, tokens, status de pagamento, qualquer
  backup que contenha esses dados.

Dados restritos nunca podem ser escritos pelo cliente nem aparecer no frontend.
Dados confidenciais exigem base legal e cuidado de LGPD.

## Superfícies de ataque prioritárias

Concentre a atenção onde o risco é maior nesta stack:

| Superfície | Risco dominante | Vai para |
|---|---|---|
| Regras do Firestore | vazamento entre usuários, auto-promoção a pago | 02 |
| Webhook de pagamento | liberar plano sem pagar | 03 |
| Funções `api/` | BOLA, injeção, abuso, SSRF | 03 |
| Segredos e chaves | uso indevido de Gemini, Cloudinary, admin | 05 |
| Frontend | XSS, cópia do site | 04 |
| Headers e CSP | clickjacking, injeção, sniffing | 04 |
| LGPD | sanção por vazamento | 06 |

## Saída desta fase

Produza um mapa curto em texto: stack detectada, lista de rotas de API, onde estão
os segredos, quais dados pessoais trafegam, o que é público e o que é privado.
Esse mapa orienta quais varreduras rodar na Fase 1.
