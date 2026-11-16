// Template de webhook da Cakto para função serverless (Vercel).
// A Cakto NAO usa HMAC no cabecalho. Ela envia o campo `secret` DENTRO do corpo JSON.
// Verificacao correta: comparar o secret do corpo com o secret guardado, em tempo
// constante, e reconciliar pela API antes de liberar. Adapte ao seu runtime.
//
// Variaveis de ambiente (no painel da Vercel, nunca no codigo):
//   CAKTO_WEBHOOK_SECRET  -> o UUID gerado ao criar o webhook no painel da Cakto
//   CAKTO_CLIENT_ID / CAKTO_CLIENT_SECRET -> para reconciliar via API OAuth2

import crypto from "node:crypto";

// Importante: ler o corpo CRU. Na Vercel, desabilite o parser automatico para esta
// rota (export const config = { api: { bodyParser: false } }) e leia o stream, ou
// use a API de request que expoe o texto cru. O exemplo assume `rawBody` (string).

function secretConfere(recebido, esperado) {
  if (typeof recebido !== "string" || typeof esperado !== "string") return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false; // timingSafeEqual exige mesmo tamanho
  return crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await lerCorpoCru(req); // implemente conforme seu runtime
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).end();
  }

  // 1. Verificar a origem: secret do corpo x secret do ambiente, tempo constante.
  if (!secretConfere(payload.secret, process.env.CAKTO_WEBHOOK_SECRET)) {
    return res.status(401).end(); // nao logar o secret nem o corpo
  }

  // 2. Agir so no estado certo.
  if (payload.event !== "purchase_approved" || payload?.data?.status !== "paid") {
    return res.status(200).end(); // recebido, mas nada a fazer
  }

  const pedidoId = payload.data.id;

  // 3. Idempotencia: se ja processou este id, para (escrita atomica no seu banco).
  if (await jaProcessado(pedidoId)) {
    return res.status(200).end();
  }

  // 4. Reconciliar pela API oficial da Cakto: o corpo e falsificavel.
  const pedidoReal = await consultarPedidoNaCakto(pedidoId);
  if (!pedidoReal || pedidoReal.status !== "paid") {
    await registrarSuspeita(pedidoId, "reconciliacao falhou");
    return res.status(200).end(); // nao libera
  }

  // 5. Conferir valor e produto contra o SEU catalogo, nao contra o corpo.
  const oferta = await ofertaDoCatalogo(payload.data.offer.id);
  if (!oferta || Number(pedidoReal.amount) < Number(oferta.preco)) {
    await registrarSuspeita(pedidoId, "valor divergente");
    return res.status(200).end();
  }

  // 6. Liberar com credencial de admin (server-side), nunca pelo cliente.
  await liberarAcesso(payload.data.customer.email, oferta.id);

  // 7. Marcar como processado (atomico) e registrar auditoria sem o secret.
  await marcarProcessado(pedidoId);
  await registrarEvento(pedidoId, "liberado");

  // 8. Responder rapido (limite de 5s da Cakto). Se reconciliacao for lenta,
  //    responda 200 antes e faca os passos 4-7 numa fila.
  return res.status(200).end();
}

// Assinaturas a implementar conforme seu projeto:
// lerCorpoCru(req), jaProcessado(id), consultarPedidoNaCakto(id),
// ofertaDoCatalogo(ofertaId), liberarAcesso(email, ofertaId),
// marcarProcessado(id), registrarEvento(id, estado), registrarSuspeita(id, motivo)
