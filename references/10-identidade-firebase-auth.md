# Identidade e Firebase Auth

Autenticação diz quem é o usuário. Autorização diz o que ele pode fazer. Ter login
não basta: cada ação sensível precisa verificar permissão no servidor. As regras do
Firestore (`references/11-firestore-regras.md`) fazem a autorização na camada de
dados; esta referência trata da identidade em si.

## Controles do Firebase Auth

- Verificação de e-mail obrigatória antes de liberar área paga ou de edição.
- Política de senha forte e proteção contra senhas vazadas ligadas no console
  (Authentication, Settings). O Firebase pode recusar senhas que aparecem em
  vazamentos conhecidos.
- MFA oferecido aos usuários, e obrigatório para contas administrativas.
- App Check ligado (reCAPTCHA Enterprise ou v3) para que só o app legítimo consiga
  chamar Auth, Firestore e funções. Sem App Check, um script externo conversa direto
  com seu backend. É um sinal e uma camada a mais, não substitui as regras nem a
  autorização; um cliente comprometido ainda pode burlá-lo. Ação de painel.
- 2FA na conta Google que administra o projeto. É o ponto único de falha: se cai,
  cai tudo. Ação de painel, prioridade alta.

## Token e sessão

- Rotas sensíveis validam o `idToken` do Firebase no servidor com o Admin SDK antes
  de agir. Nunca confie que o cliente "está logado" só porque a tela diz isso.
- Token de sessão em cookie `HttpOnly`, `Secure`, `SameSite`, não em `localStorage`,
  que é lido por XSS. Revogue sessão no logout, no reset de senha e na suspeita.
- Se você usa JWT próprio em algum ponto, valide assinatura, emissor, audiência e
  expiração, e aceite só os algoritmos que você configurou. Nunca use `decode` sem
  verificar a assinatura, e nunca aceite o algoritmo que veio no token.

## Chave da API do Firebase

- A `apiKey` pública do cliente é normal ficar no frontend. É identificador, não
  segredo. O que protege é a regra do Firestore mais o App Check. Não a trate como
  vulnerabilidade (ver `references/02-anti-falso-positivo.md`).
- Restrinja essa chave no Google Cloud Console por referrer HTTP e habilite só as
  APIs necessárias, como hardening. Ação de painel.
- O que nunca pode aparecer no cliente é a service account de admin. Essa é a
  credencial que ignora as regras e escreve campos privilegiados. Se vazar, é
  CRÍTICO e exige rotação.

## Recuperação de conta

- O fluxo de recuperação de senha usa token aleatório, curto e de uso único, ligado
  à conta, e não revela se a conta existe (mesma resposta para e-mail cadastrado ou
  não). Alteração de fator de autenticação gera notificação ao usuário.

## Saída

Registre o estado de verificação de e-mail, política de senha, MFA dos usuários e
2FA dos admins, App Check, validação de token no servidor, armazenamento do token de
sessão e restrição da chave. Os itens de console entram como pendências do usuário
com passo a passo.
