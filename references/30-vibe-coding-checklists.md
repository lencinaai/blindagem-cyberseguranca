# Checklists de vibe coding: bateria de perguntas por camada

Estes checklists são o caminho mais rápido de revisão. Servem como roteiro de
perguntas ao inspecionar cada camada, em vez de reinventar a lista a cada auditoria.
O fio condutor é um só: nunca confie no cliente. Tudo que chega do navegador ou do
app pode ser forjado, então a verdade mora no servidor.

A IA gera o "caminho feliz" e ignora os casos de borda, e é na borda que a segurança
vive. Por isso, quando algo foi criado com IA, estas perguntas quase sempre pegam
furo.

## Fronteira frontend e backend (o princípio mestre)

- Todo dado sensível e toda validação de regra de negócio ficam no servidor. O
  frontend só manda um comando ou um identificador; o servidor decide e devolve só o
  resultado. Preço, permissão, limite de plano, status de pagamento: sempre no
  servidor.
- Pergunta-chave para cada endpoint: quem pode chamar isto, precisa de autenticação,
  precisa de autorização, e o que acontece se um usuário malicioso chamar direto sem
  passar pela sua tela.

## Segredos e chaves

- Nenhuma chave secreta, senha ou string de conexão no frontend, no bundle, no app
  mobile, no Git ou em log. Variável de ambiente exposta ao cliente é tratada como
  pública.
- `.env` no `.gitignore`. Se um `.env` já foi commitado, o segredo é considerado
  comprometido e deve ser rotacionado, porque o histórico do Git é permanente.
- Chamada a serviço faturado (Gemini, Cloudinary, e-mail, pagamento) sempre pelo
  backend, nunca com a chave no cliente.

## Banco de dados e autorização (Firestore, ou RLS em outros bancos)

- Autorização no servidor por dono e por papel. O usuário só lê e escreve o próprio
  dado. Ver `references/11-firestore-regras.md` para a auditoria adversarial.
- Nunca guarde na mesma linha ou documento que o usuário pode editar os campos que
  dão poder ou dinheiro: `pro`, `plano`, `creditos`, `role`, `subscription`. Senão
  ele se dá crédito infinito ou vira admin pelo console do navegador. Esses campos
  só o backend com credencial de admin escreve.
- Traga só os campos necessários por rota. Não devolva `password_hash`, notas
  internas, dados de outro usuário. Menor exposição.
- Atribuição em massa: não grave o objeto inteiro que veio do cliente. Use uma
  allowlist de campos permitidos.

## Pagamentos e webhook

- Confirme pagamento pelo webhook validado no servidor, nunca por o cliente dizer
  que pagou. Ver `references/20-pagamentos-cakto.md`.
- Verifique a origem, tenha idempotência por id do evento, confira valor e produto
  contra o seu catálogo, e reconcilie consultando a API do provedor.

## Integração com IA (Gemini)

- Chave só no servidor, com proxy. Teto de gasto por usuário no banco e alerta de
  billing. Trate entrada e conteúdo externo como não confiável (injeção de prompt).
  Ver `references/21-ia-gemini.md`.

## Upload de arquivos e imagens

- Valide tamanho, extensão e principalmente os magic bytes, lendo os primeiros bytes
  do arquivo, nunca confiando no `content-type` que veio na requisição.
- Reprocesse a imagem (por exemplo com uma biblioteca de imagem) para destruir
  payload embutido em metadados. Renomeie o arquivo, não use o nome original.
- SVG é XML com JavaScript possível: sanitize como XML ou não aceite SVG de
  desconhecido. Cuidado com path traversal (`../`) no nome. Ver
  `references/23-cloudinary-storage.md`.

## Rate limit e teto de gasto

- Rate limit no servidor, nunca só no cliente (o contador do cliente é editável).
  Nas rotas de login, reset de senha, IA, e-mail e pagamento. Ver
  `references/40-backups-resiliencia.md`.
- Teto de orçamento em cada serviço faturado, como proteção contra chave vazada,
  loop de IA e ataque de volume.

## Autenticação e sessão

- Distinga autenticação (quem você é) de autorização (o que você pode fazer). Ter
  login não basta; cada ação verifica permissão no servidor.
- Token de sessão em cookie `HttpOnly`, `Secure`, `SameSite`, não em `localStorage`
  (que é lido por XSS). Ver `references/13-frontend-headers-csp.md`.

## Deploy

- Remova debug, stack trace e log detalhado em produção. Source map fora de
  produção. Nada de `.git` acessível pela URL. Ver
  `references/13-frontend-headers-csp.md` e `references/70-ferramentas-varredura.md`.

## Saída

Para cada camada aplicável, registre as perguntas respondidas e os furos como
achados no catálogo, com gravidade e confiança. Este checklist é o roteiro; a
correção e o reteste seguem o ciclo do `SKILL.md`.

Fonte: raroque vibe security e material consolidado de segurança para apps feitos
com IA.
