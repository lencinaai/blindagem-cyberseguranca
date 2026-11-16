# Filtro anti falso positivo

Uma varredura que grita a cada linha perde a confiança do usuário e faz corrigir o
que não precisa. Antes de registrar qualquer achado no catálogo, passe por este
filtro. Ele vale para qualquer camada, não só código.

## Níveis de confiança

Todo achado sai daqui com um nível, que vai junto da gravidade no relatório:

- Confirmado: você reproduziu, ou o código prova sem ambiguidade. Vai como
  vulnerabilidade.
- Alta confiança: padrão claro de falha, sem reprodução. Vai como achado, marcado
  como não reproduzido.
- Precisa verificação: depende de configuração de painel, de lógica de negócio ou de
  estado de produção que você não lê só pelo código. Vai como pergunta ao usuário,
  não como afirmação de falha.
- Hardening: melhoria de defesa em profundidade, não uma falha explorável. Vai numa
  seção à parte, com gravidade baixa.
- Falso positivo: parece falha mas não é. Não vai para o relatório, ou vai anotado
  como descartado, para não reaparecer na próxima revisão.

Não misture hipótese com vulnerabilidade confirmada no relatório executivo. O
usuário precisa saber o que é fato e o que é suspeita a confirmar.

## O que nunca sinalizar como vulnerabilidade

Estes casos parecem falha para quem varre por palavra-chave, mas são uso legítimo:

- Valor controlado pelo servidor tratado como se fosse entrada do atacante. Se o
  dado nunca passa pelo cliente, ele não é superfície de ataque de entrada.
- Auto-escape de framework. React, Vue, Angular e Svelte escapam a saída por padrão.
  Interpolar texto numa view desses frameworks não é XSS. Só vira risco quando há
  bypass explícito, como `dangerouslySetInnerHTML`, `v-html`, `innerHTML` ou
  `bypassSecurityTrust`.
- Config pública que é pública por design. A `apiKey` do Firebase no cliente é
  identificador público, não segredo. O que protege o Firebase é a regra do
  Firestore e o App Check, não esconder a apiKey. A chave publicável da Stripe
  (`pk_live`) e a chave anônima do Supabase também são públicas por design. Não
  confunda com a service account, a chave secreta ou a `service_role`.
- Query parametrizada ou ORM tratados como injeção. Se a entrada vai como parâmetro,
  não como concatenação de string no comando, não é injeção.
- Falta de um controle que outra camada já cobre. Um header ausente numa rota que
  não renderiza HTML, ou CSRF numa API que só aceita token no header e não usa
  cookie de sessão, pode não ser risco real. Avalie o modelo de ameaça do caso.
- Hash de senha "fraco" que na verdade é o algoritmo certo com parâmetro adequado, ou
  uso de `Math.random` para algo que não é segredo (uma cor, um id de UI).

## Como decidir a gravidade real

Não herde a gravidade de um scanner nem de um CVE cego. Avalie:

- Impacto: o que acontece se for explorado. Vazamento de dado de muitos usuários e
  fraude de pagamento são o topo.
- Explorabilidade: precisa de quê para explorar. Anônimo pela internet é pior que
  exige conta autenticada e privilégio.
- Exposição: é público ou interno, atrás de autenticação ou não.
- Controles existentes: já há App Check, rate limit, WAF, autorização no servidor.
- Raio de alcance: afeta um usuário ou todos, um dado ou o banco inteiro.

Uma mesma classe muda de gravidade conforme o contexto. Header ausente é médio numa
página institucional e alto numa página de pagamento. App Check ausente é médio se
as regras do Firestore já isolam por dono, e mais grave se as regras forem frouxas.

## Saída

Cada achado registrado leva gravidade e confiança. Os itens "precisa verificação"
viram perguntas ao usuário sobre o painel ou a lógica de negócio. Os falsos
positivos descartados ficam anotados para não voltarem.

Fonte da metodologia: getsentry security review, baseada nos OWASP Cheat Sheets.
