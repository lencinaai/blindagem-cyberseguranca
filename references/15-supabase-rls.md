# Supabase e Postgres (RLS)

Se o projeto usa Supabase em vez de Firebase, o modelo de autorização muda de
Security Rules para Row Level Security (RLS) do Postgres. O princípio é o mesmo do
`references/11-firestore-regras.md`, mas os detalhes são próprios.

## O risco central

- A chave anônima (anon key) é pública e vai para o frontend, por design. Qualquer um
  com ela pode consultar o banco pela API REST do Supabase.
- CRÍTICO: sem RLS ativado, essa chave lê a tabela inteira. Ative RLS em toda tabela
  com dado real, e escreva políticas.
- CRÍTICO: a chave `service_role` ignora o RLS. Ela é credencial de admin e nunca
  pode aparecer no cliente. Só no servidor.

## Políticas

- Política por operação (select, insert, update, delete), granular: o usuário só vê e
  edita o próprio dado, comparando `auth.uid()` com a coluna de dono.
- `USING` filtra o que pode ser lido ou afetado. `WITH CHECK` valida o que pode ser
  escrito. Sem `WITH CHECK` num update, o usuário pode mudar o `user_id` e roubar o
  registro de outro.
- NUNCA `USING (true)` numa tabela com dado real: libera tudo. É o erro que a IA gera
  quando você pede "cria uma política que permite ler os perfis" sem detalhar.

## Tabelas separadas por sensibilidade

Não guarde na mesma linha que o usuário edita os campos que dão poder ou dinheiro
(`plano`, `creditos`, `role`, `subscription`), senão ele se dá crédito infinito. Use
tabela pública (avatar, bio), tabela privada (só leitura pelo dono, escrita pelo
servidor) e tabela de admin. RPC, views e functions do Postgres também respeitam a
autorização; revise cada uma.

## Storage

- As policies do Supabase Storage seguem a mesma lógica de RLS. Bucket privado por
  padrão, com política por dono.

## Como testar

- Teste com dois usuários: A não lê nem escreve dado de B, em toda tabela, view, RPC
  e bucket. Teste também que o usuário não muda o próprio `plano` ou `role`.

## Saída

Liste tabelas sem RLS, políticas `USING (true)`, ausência de `WITH CHECK`, campos
privilegiados na tabela do usuário, e uso da service_role. Referência: documentação
oficial de RLS do Supabase e Postgres.
