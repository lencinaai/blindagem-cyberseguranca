# Resposta a incidentes

Segurança madura assume que um incidente pode acontecer e se prepara antes de
precisar. Esta referência traz o ciclo e playbooks curtos para os cenários mais
prováveis desta stack.

## O ciclo (NIST 800-61r3 e SANS)

1. Preparação: ter os contatos, os acessos de emergência e este plano escrito antes
   de precisar.
2. Identificação: confirmar que houve incidente real e medir o que foi exposto.
   Preservar evidência (logs, timestamps) antes de limpar.
3. Contenção: revogar sessões, banir tokens, bloquear a origem no WAF, isolar o que
   foi comprometido.
4. Erradicação: remover o acesso do atacante, fechar a falha que permitiu a entrada,
   rotacionar segredos.
5. Recuperação: restaurar de backup limpo e monitorar de perto por um período.
6. Lições aprendidas: documentar a causa raiz e ajustar para que não se repita.

Runbook escrito não prova que a equipe responde, e backup existente não prova
restauração. Faça um exercício de mesa (tabletop) pelo menos uma vez.

## Playbooks da stack

### Conta administrativa do Google comprometida

Ponto único de falha do projeto. Contenção: trocar a senha, revisar e revogar
sessões e apps conectados, confirmar 2FA reativo. Erradicação: revisar quem tem
acesso ao projeto Firebase e ao Google Cloud, remover acessos indevidos, rotacionar
service accounts. Recuperação: revisar regras do Firestore e logs de acesso do
período. Prevenção: 2FA obrigatório, conta de admin separada do uso diário.

### Chave do Gemini vazada

Contenção imediata: rotacionar a chave no Google Cloud, o que invalida a antiga.
Identificação: verificar o consumo e o valor gerado na janela. Erradicação: achar
onde a chave vazou (frontend, Git, log) e mover a chamada para o servidor com proxy.
Recuperação: aplicar restrição de chave por IP ou domínio e teto de gasto.

### Fraude confirmada no webhook da Cakto

Identificação: comparar os eventos de liberação com os pagamentos reais na API da
Cakto e achar as liberações sem pagamento. Contenção: revogar os acessos liberados
por fraude. Erradicação: corrigir a validação do webhook (secret, idempotência,
reconciliação por API, ver `references/20-pagamentos-cakto.md`). Recuperação:
reconciliar toda a base de acessos pagos contra a Cakto.

### Vazamento de coleção do Firestore

Identificação: confirmar qual coleção e quais dados ficaram legíveis, e por quanto
tempo (regra aberta). Contenção: fechar a regra imediatamente e publicar. Avaliação
de dano: se havia dado pessoal, acionar o fluxo da LGPD abaixo. Erradicação: rodar a
auditoria adversarial das regras (ver `references/11-firestore-regras.md`).
Recuperação: notificar se aplicável e monitorar.

## Notificação de incidente à ANPD

Se houver incidente com dados pessoais que possa acarretar risco ou dano relevante
aos titulares, a LGPD exige comunicação. Pela Resolução CD/ANPD 15/2024, o prazo é
de até três dias úteis a contar do conhecimento, admitida comunicação em etapas
quando a informação ainda está incompleta. Mantenha registro de todos os incidentes,
inclusive os não comunicados, por pelo menos cinco anos.

Cuidado com uma simplificação comum: dizer que dado cifrado dispensa a comunicação é
forte demais. A avaliação depende de risco e dano relevante, do algoritmo, de quem
tinha a chave e de quais dados foram atingidos, conforme os critérios da resolução. A
decisão é do controlador e deve ser registrada, de preferência com apoio jurídico.

## Saída

Registre se existe plano escrito, se os contatos e acessos de emergência estão
prontos, e se houve tabletop. Em um incidente real, siga o ciclo, preserve evidência
antes de limpar, e trate a obrigação legal como avaliação do controlador.
