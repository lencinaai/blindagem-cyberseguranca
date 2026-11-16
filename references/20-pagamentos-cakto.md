# Pagamentos e webhook da Cakto: a falha mais cara

O webhook de pagamento é a porta onde alguém libera produto pago sem pagar. Esta
referência corrige um erro comum: a Cakto não assina o webhook com HMAC como a
Stripe. O modelo dela é mais simples e mais fraco, e isso muda a correção.

## Como a Cakto realmente autentica o webhook

A Cakto envia um campo `secret` dentro do corpo JSON do webhook. Esse `secret` é um
UUID gerado quando você cria o webhook no painel (formato, mascarado:
`00000000-0000-0000-0000-000000000000`). Não há assinatura HMAC no cabeçalho, não há
header `x-cakto-signature`, não há timestamp assinado. A verificação é comparar o
`secret` que veio no corpo com o secret que você guardou no servidor.

Formato do payload de compra aprovada:

```json
{
  "secret": "00000000-0000-0000-0000-000000000000",
  "event": "purchase_approved",
  "data": {
    "id": "81b408ee-2a91-427d-80bd-226cbeae1fa0",
    "refId": "AUAe5xK",
    "status": "paid",
    "amount": 5.55,
    "paymentMethod": "pix",
    "paidAt": "2026-01-01T12:00:00Z",
    "customer": { "name": "...", "email": "...", "phone": "..." },
    "offer": { "id": "B8BcHrY", "name": "...", "price": 5.55 },
    "product": { "id": "...", "short_id": "...", "type": "unique" },
    "offer_type": "main"
  }
}
```

Eventos (14): `initiate_checkout`, `checkout_abandonment`, `purchase_approved`,
`purchase_refused`, `pix_gerado`, `boleto_gerado`, `picpay_gerado`,
`openfinance_nubank_gerado`, `chargeback`, `refund`, `subscription_created`,
`subscription_canceled`, `subscription_renewed`, `subscription_renewal_refused`.

A API da Cakto (base `https://api.cakto.com.br/`) usa OAuth2: `client_id` e
`client_secret` do painel geram um `access_token`, e as chamadas usam o header
`Authorization: Bearer {token}`. A sua aplicação precisa responder o webhook em até
5 segundos, senão a entrega falha.

## Por que esse modelo é frágil e o que ele exige

Comparar um token que veio no corpo é mais fraco que HMAC por três razões, e cada
uma vira um controle obrigatório.

1. **O secret não prova integridade do corpo.** Ele só prova que quem enviou
   conhecia o secret. Se o secret vazar uma vez, por log, print, captura ou commit,
   qualquer pessoa forja um `purchase_approved`. Por isso: nunca registre o corpo do
   webhook em log, e trate o secret como segredo de servidor.
2. **Não há proteção nativa contra replay.** O mesmo payload válido pode ser
   reenviado. Por isso: idempotência por `data.id`.
3. **O corpo é a única prova, e é falsificável.** Por isso o controle mais forte:
   não confie apenas no webhook. Consulte a API oficial da Cakto pelo `data.id` e
   confirme que o pedido existe e está pago, com o valor esperado, antes de liberar.

## Checagens

1. CRÍTICO: o webhook libera o plano sem validar a origem. Sem comparar o `secret`
   do corpo com o secret guardado, é CRÍTICO.
2. CRÍTICO: comparação de secret com `==` ou `===` simples, ou secret fixo no
   código. Deve ser comparação de tempo constante, e o secret vem do ambiente.
3. ALTO: ausência de idempotência por `data.id`. Permite liberação duplicada por
   replay do mesmo evento.
4. ALTO: não confere valor nem produto. Verifique que `data.amount` e `data.offer`
   correspondem ao plano liberado, para impedir pagar o barato e receber o caro. O
   mesmo princípio de nunca confiar no preço do cliente vale aqui: o valor de
   referência é o do seu catálogo no servidor, não o que veio no corpo.
5. ALTO: sem reconciliação por API. Confiar só no corpo do webhook é confiar num
   dado falsificável. Consulte a Cakto e confirme.
6. MÉDIO: a liberação é feita no cliente. A escrita do status pago tem que ser feita
   pela função com Admin SDK, depois de validar, nunca disparada pelo cliente.
7. MÉDIO: endpoint do webhook sem rate limit ou sem HTTPS forçado.

## Estrutura correta da função de webhook

```
1. Ler o corpo cru (raw body).
2. Comparar payload.secret com o secret do ambiente em tempo constante
   (crypto.timingSafeEqual). Diferente: responde 401 e para.
3. Conferir event e data.status para agir só no estado certo
   (purchase_approved com status pago).
4. Idempotencia: se data.id ja foi processado, responde 200 e para.
5. Reconciliar: consultar a API da Cakto pelo data.id e confirmar existencia,
   status pago, valor e produto. Divergiu do catalogo: recusa e registra.
6. Escrever o status pago com Admin SDK.
7. Marcar data.id como processado (escrita atomica).
8. Registrar o evento (aceito e recusado) para auditoria, sem logar o secret.
9. Responder 200 dentro de 5 segundos. Se a reconciliacao for lenta, responder
   200 rapido e processar em fila.
```

O template pronto está em `assets/webhook-cakto.example.js`.

## Reteste (obrigatório após corrigir)

- Enviar um POST com `secret` errado no corpo e confirmar 401, sem liberação.
- Enviar um POST com `secret` certo e `data.id` repetido e confirmar que não
  processa duas vezes.
- Enviar um POST com `data.amount` menor que o preço real da oferta e confirmar que
  a reconciliação recusa.

## Nota de atualidade

A Cakto, na documentação atual, não publica verificador oficial nem menciona HMAC.
Reavalie em cada uso, porque provedores mudam o esquema. Se a Cakto passar a assinar
com cabeçalho, migre para a assinatura e mantenha a reconciliação por API como
defesa em profundidade. Fontes: documentação oficial da Cakto em
`docs.cakto.com.br` e `cakto-dece4a15.mintlify.app/webhooks/pagamento-unico`,
verificadas em julho de 2026.

## Se um dia usar outro provedor (Stripe, Mercado Pago)

O princípio muda conforme o provedor. Stripe e Mercado Pago assinam com HMAC no
cabeçalho (`Stripe-Signature`, `x-signature`), com o corpo cru e o segredo do
webhook, mais timestamp contra replay. Nesse caso, use a biblioteca oficial do
provedor para verificar, e mantenha idempotência e reconciliação do mesmo jeito.
Nunca confie no preço ou no status que veio no corpo, em nenhum provedor.
