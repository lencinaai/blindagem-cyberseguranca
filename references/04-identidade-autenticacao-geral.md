# Identidade e autenticação (geral)

Esta referência é a base de identidade para qualquer stack. Para Firebase Auth
especificamente, ver `references/10-identidade-firebase-auth.md`. Aqui estão os
princípios que valem para OAuth, JWT, senha e sessão em qualquer sistema.

## Garantia de identidade proporcional ao risco

Classifique as jornadas por risco. Cadastro, login, recuperação, e operações
administrativas ou financeiras não pedem o mesmo nível. Ação de alto impacto exige
autenticação forte e, quando faz sentido, reautenticação no momento (step-up).
Referência: NIST SP 800-63-4 (2025).

## Senhas e recuperação

- Aceite senhas longas. Bloqueie senhas comuns e já vazadas. Não force composição
  arbitrária (um número, um símbolo) nem troca periódica sem indício de
  comprometimento. Referência: NIST SP 800-63B-4.
- Guarde só a derivação resistente: Argon2id, ou bcrypt/scrypt/PBKDF2 com parâmetro
  atual, com sal individual, e de preferência um pepper no servidor (ver
  `references/14-segredos-cripto.md`). Nunca MD5, SHA1 ou SHA256 puro para senha.
- Recuperação usa token aleatório, curto e de uso único, ligado à conta, e não
  revela se a conta existe. Nunca envie a senha por e-mail nem use pergunta pessoal
  como fator.

## MFA e passkeys

- Ofereça MFA aos usuários e exija para administradores e ações de alto impacto.
- Prefira autenticador resistente a phishing (passkey, WebAuthn) quando suportado.
  SMS não é equivalente a método resistente a phishing.
- Cadastro, remoção e recuperação de fator exigem verificação equivalente e geram
  notificação ao usuário.

## OAuth 2.0 e OIDC

- Redirect URIs pré-registradas e comparadas exatamente. Clientes públicos usam
  Authorization Code com PKCE. Não use implicit grant nem password grant em sistema
  novo. Valide state e nonce. Restrinja audience e escopo. Proteja refresh token com
  rotação e detecte reutilização. Referência: RFC 9700 (OAuth Security BCP).

## JWT

- Aceite só a allowlist de algoritmos que você configurou. Valide assinatura,
  emissor, audiência, expiração e tipo. Nunca escolha o algoritmo a partir do token
  (ataque `alg: none` e confusão de algoritmo). Nunca use `decode` sem verificar. Um
  claim recebido não é autorização sem validação de negócio. Referência: RFC 8725.

## Sessão e cookies

- Identificador de sessão com entropia suficiente, regenerado após login e após
  elevação, expirado por inatividade e por limite absoluto, revogado no logout,
  reset e suspeita.
- Cookie de sessão com `Secure`, `HttpOnly`, `SameSite` apropriado, `Domain` mínimo
  e `Path` mínimo. Prefira o prefixo `__Host-` quando compatível. Não guarde token de
  sessão em `localStorage`, que é lido por XSS.

## Saída

Registre nível de garantia por jornada, política de senha, cobertura de MFA nos
admins, fluxo de OAuth, validação de JWT e atributos de cookie. Gravidade alta para
falha em admin, recuperação e token.
