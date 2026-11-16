# Google Apps Script

Apps Script vira uma API pública quando é publicado como web app com `doGet` ou
`doPost`, expondo uma URL `/exec`. Isso é uma superfície de ataque igual a qualquer
rota, com um agravante: pode rodar com a autoridade do dono.

## O par perigoso de execução e acesso

Na publicação do web app há duas escolhas que juntas definem o risco:

- CRÍTICO: "Executar como: eu (dono)" combinado com "Quem tem acesso: qualquer
  pessoa". Nesse modo, o endpoint roda com as permissões do dono para qualquer
  visitante anônimo. Se o `doPost` toca planilha, Drive, Gmail, Firestore ou banco,
  um estranho aciona isso com a autoridade do dono, pela URL, sem login.
- Preferir "Executar como: o usuário que acessa" quando fizer sentido, e restringir
  o acesso ao mínimo (por domínio ou usuários específicos) sempre que possível.
- Quando o web app roda como o usuário, use `ScriptApp.getAuthorizationInfo` para
  checar se os escopos foram concedidos antes de chamar serviços.

## O endpoint /exec

- ALTO: a URL do `/exec` tratada como secreta. Ela é pública por natureza; não
  confie na obscuridade. Se o `doPost` executa ação com efeito, exija um token
  compartilhado no corpo ou verificação de origem, e valide toda entrada antes de
  usar.
- MÉDIO: sem limite lógico de chamadas. Apps Script tem cotas de execução que podem
  ser abusadas para gerar custo ou indisponibilidade. Aplique um limite lógico e
  rejeite o que não for esperado.
- Valide `doGet` e `doPost` como qualquer API: tipo, formato e tamanho de cada
  campo, e rejeite o resto.

## Escopos de OAuth

- ALTO: escopos amplos concedidos por inferência automática. O Apps Script infere
  escopos do código, o que dá mais permissão do que o necessário.
- Use sempre o conjunto de escopos menos permissivo possível, e para scripts
  publicados declare os escopos explicitamente no manifesto `appsscript.json`, no
  campo `oauthScopes`. Isso trava o script no mínimo e evita que o usuário conceda
  acesso amplo sem perceber.

## Segredos e configuração

- `PropertiesService` (Script Properties) serve para configuração e chaves não
  críticas. Guarda pares chave-valor com escopo no script, que não aparecem no
  editor de código. É melhor que valor fixo no `Code.gs`.
- Para segredo sensível de verdade, o Google recomenda Secret Manager, que dá log de
  auditoria, versionamento e controle fino por IAM. A combinação recomendada é
  PropertiesService para configuração e Secret Manager para o segredo real.
- CRÍTICO: se o Apps Script escreve no Firestore com service account, essa é a
  credencial de admin que libera campos privilegiados. Proteja-a como restrita e
  nunca a coloque em log nem no cliente.

## Saída

Liste o modo de execução e acesso do web app, se o `/exec` valida token e entrada,
se os escopos estão declarados no manifesto e mínimos, e onde os segredos estão
guardados. O modo de publicação do web app é ação de painel do usuário.

Fontes: documentação oficial do Apps Script sobre Authorization Scopes, Authorization
for Google Services e Web Apps, e os guias de segurança do Google Workspace.
