# Regras do Firestore: auditoria adversarial

Esta é a camada de maior risco em apps Firebase. A maioria dos vazamentos não vem de
um hacker sofisticado, vem de uma regra do Firestore aberta que deixa qualquer
pessoa ler ou escrever dados de outro usuário direto pela API, sem nem passar pelo
seu site. Comece por aqui, e trate esta auditoria como sub-rotina obrigatória sempre
que houver `firestore.rules`.

## O que inspecionar

Abra `firestore.rules`. Procure por estes problemas, do mais grave ao menos:

1. CRÍTICO: `allow read, write: if true;` em qualquer coleção com dados reais. Isso
   libera o banco para o mundo. Mesmo `allow read: if true;` é vazamento se a
   coleção tem dado pessoal.
2. CRÍTICO: Test Mode ainda ligado (regra que expira permitindo tudo até uma data).
3. CRÍTICO: o cliente consegue escrever campos privilegiados. Se o usuário pode dar
   `update` no próprio documento e nada impede que ele mude `pro`, `plano`, `cupom`,
   `role` ou `creditos`, ele se promove a pago de graça pelo console do navegador.
4. ALTO: leitura ou escrita sem checar dono. Toda regra de documento privado deve
   comparar `request.auth.uid` com o dono do documento.
5. ALTO: `allow write` sem validar formato, tipo e tamanho dos campos, abrindo
   espaço para dados malformados e abuso de armazenamento.
6. MÉDIO: leitura pública ampla onde só precisava do documento publicado.

## Auditoria adversarial de 6 pontos (pontuação 1 a 5)

Não basta ler a regra e achar que está bem. Para cada coleção, ataque a regra com
estas seis perguntas e dê uma nota de 1 (aberto, falha grave) a 5 (fechado e
testado). A coleção só passa com todas em 4 ou 5.

1. Bypass de update: um `update` consegue trocar um campo que deveria ser imutável
   (dono, status de pagamento, papel)? A regra usa `diff().affectedKeys()` para
   travar esses campos?
2. Fonte de autoridade: de onde vem o `uid` ou o campo de dono que a regra confia?
   Ele é estabelecido pelo servidor no `create`, ou o cliente pode forjá-lo?
3. Lógica de negócio versus regra: a regra deixa passar uma operação válida no
   formato mas inválida no negócio (por exemplo, criar pedido já marcado como pago)?
4. Abuso de armazenamento e custo: a regra limita tamanho e quantidade, ou permite
   gravar documentos gigantes ou infinitos, gerando custo?
5. Segurança de tipo: a regra valida tipo de cada campo, ou aceita qualquer coisa
   que depois quebra o app ou vira injeção de dado?
6. `hasOnly()` e `diff()` sem checagem de dono: a validação de campos existe, mas
   sem confirmar que quem escreve é o dono? As duas coisas precisam andar juntas.

Nuance importante: o Firestore nega por ausência, e regras que se sobrepõem são OR.
O risco real vem de uma regra permissiva, não da falta de um bloco de negação no
fim. Ainda assim, negar por padrão no fim documenta a intenção e evita coleção
esquecida aberta. O Admin SDK e o servidor ignoram as Security Rules, então a
credencial de servidor tem que usar IAM mínimo.

## Baseline correto

O arquivo `assets/firestore.rules.baseline` traz uma espinha dorsal segura. A lógica
essencial: negação por padrão no fim, documento privado só do dono comparando `uid`,
página publicada com leitura pública e escrita só do dono, campo privilegiado
bloqueado com `diff().affectedKeys()`, e validação de tipo e tamanho na regra.

Exemplo do bloqueio de auto-promoção, a falha CRÍTICA mais comum:

```
match /usuarios/{uid} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow create: if request.auth != null && request.auth.uid == uid;
  allow update: if request.auth != null
    && request.auth.uid == uid
    && !request.resource.data.diff(resource.data).affectedKeys()
         .hasAny(['pro','plano','cupom','role','creditos']);
}
```

Os campos de pagamento só podem ser escritos pelo Admin SDK, numa função serverless
ou no Apps Script com service account, depois de validar o webhook.

## Como testar (obrigatório antes de publicar)

Não confie em ler a regra. Teste com o emulador, escrevendo casos que tentam violar
o isolamento. O esqueleto do `test-rules.js` está em
`references/70-ferramentas-varredura.md`. Conjunto mínimo:

- Usuário A não lê nem escreve documento de usuário B.
- Usuário não altera o próprio `pro` ou `plano`.
- Anônimo não lê coleção privada.
- Leitura da página publicada funciona para anônimo.

```bash
firebase emulators:exec --only firestore "node test-rules.js"
```

Cada teste de violação que passar é um vazamento, gravidade CRÍTICO.

## Saída

Para cada coleção, registre a pontuação dos 6 pontos, os achados com gravidade e
confiança, o trecho afetado, a correção e o teste de emulador que comprova o
conserto.

Fonte da auditoria adversarial: firebase-security-rules-auditor, do Google.
