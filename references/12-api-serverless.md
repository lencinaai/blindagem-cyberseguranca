# API serverless e OWASP API Top 10

As funções em `api/` são as portas de entrada e saída de dados. Os ataques modernos
miram a lógica de negócio, não só a infraestrutura. Use o OWASP API Security Top 10
como mapa. Pagamento e webhook estão em `references/20-pagamentos-cakto.md`; Apps
Script em `references/22-apps-script.md`.

## OWASP API Top 10 nas funções `api/`

Para cada arquivo em `api/`, verifique:

- API1 BOLA (autorização no nível do objeto): a rota recebe um id e devolve o
  registro sem checar se o solicitante é o dono? Isso é IDOR/BOLA, gravidade ALTO a
  CRÍTICO. Corrija validando a posse em toda chamada. Prefira identificadores não
  sequenciais (o id do Firestore já é aleatório, o que ajuda, mas id opaco não
  substitui a checagem de autorização).
- API2 Autenticação quebrada: rotas sensíveis precisam validar o token do Firebase
  no servidor antes de agir, com o Admin SDK.
- API3 BOPLA (atribuição em massa): a rota aceita um objeto JSON e grava todos os
  campos? Um atacante manda `pro: true` escondido. Use allowlist de campos
  permitidos na escrita, nunca grave o objeto inteiro que veio do cliente. Do lado
  da resposta, devolva só os campos necessários, sem vazar dado interno.
- API4 Consumo de recurso sem limite: rota sem rate limit permite spam de leads,
  força bruta e estouro de custo (Gemini, Cloudinary, e-mail são faturados). Aplique
  rate limit por IP e por usuário, limite de tamanho de corpo, e timeout.
- API5 BFLA (autorização no nível de função): uma rota administrativa aceita chamada
  de usuário comum? Cada função verifica o papel, não só se está logado.
- API7 SSRF: alguma rota busca uma URL fornecida pelo cliente (preview, import,
  fetch de imagem)? Valide o esquema, bloqueie ranges internos e o endereço de
  metadados da nuvem (169.254.169.254), use allowlist de domínios, e revalide o
  destino a cada redirecionamento.
- API8 Configuração incorreta: erro que vaza stack trace, CORS permissivo, header
  ausente, debug ligado em produção.

## Validação e injeção

- Validação de entrada em toda rota: tipo, tamanho, formato e faixa de cada campo,
  no servidor. Rejeite campos desconhecidos em operações sensíveis. Validação no
  cliente é só experiência de uso, nunca autoridade.
- Injeção: use query parametrizada, ORM ou API estruturada. Nunca concatene entrada
  em comando, consulta, template ou expressão. Cuidado com `eval`, com execução de
  comando do sistema e com template dinâmico.

## Defesas transversais das rotas

- CORS restrito ao seu domínio, com allowlist explícita de origem. Nada de `*` em
  rotas que escrevem dados, e nunca combine origem curinga com credenciais.
- CSRF: para ação que muda estado e usa cookie de sessão, use token anti-CSRF e
  `SameSite`, e nunca use `GET` para alterar estado. Se a API usa só token no header
  e não cookie, o risco de CSRF cai; avalie o caso (ver
  `references/02-anti-falso-positivo.md`).
- Anti-spam nos formulários públicos: honeypot, Turnstile ou reCAPTCHA, e rate limit.
- Centralize validação e rate limit num middleware que toda função importa, para a
  defesa não depender de cada rota lembrar de fazer.

## Saída

Liste cada rota com seus achados, gravidade e confiança. O reteste de autorização é
tentar acessar o recurso de um usuário com o token de outro e confirmar a recusa.
