# Logging, monitoramento e detecção

Sem log, você é cego sobre o que acontece, e um ataque pode durar meses sem ser
notado. Mas log mal feito vira um novo vazamento. As duas coisas andam juntas.

## O que registrar

- Eventos de segurança: login com sucesso e falha, elevação de privilégio, mudança
  de senha e de fator, acesso administrativo, transação sensível, webhook aceito e
  rejeitado, e erro de autorização.
- Contexto suficiente para identificar ator, ação, recurso, tenant e horário. Sem
  isso, o log não ajuda numa investigação.

## O que nunca registrar

- CRÍTICO: senha, token, cookie de sessão, secret, número de cartão, biometria, ou
  dado pessoal desnecessário. Debug em produção não pode despejar corpo de requisição
  inteiro.
- Use allowlist de campos e mascare ou tokenize o sensível antes de escrever. Teste a
  redação com valores sintéticos.

## Concentração e correlação

- Concentre os logs num repositório único, para correlacionar e achar padrão. Uma
  ferramenta central (o conceito de SIEM) junta os eventos numa linha do tempo.
- O acesso aos logs é restrito, e a retenção é definida (nem curta demais para
  investigar, nem eterna com dado pessoal).

## Alerta e resposta

- Alerte para picos de 401, muitos webhooks rejeitados, cadastros em massa, gasto
  anormal, e acesso administrativo fora de hora. Alerta que ninguém vê é câmera
  desligada.
- Ligue os alertas ao plano de resposta a incidentes (ver
  `references/60-resposta-incidentes.md`). O comportamento do atacante segue padrões
  catalogados no MITRE ATT&CK, úteis para desenhar detecção.

## Saída

Liste quais eventos de segurança são registrados, se há segredo ou dado pessoal em
log, se os logs são centralizados e protegidos, e quais alertas existem. Referências:
OWASP ASVS 5.0.0 (Logging), Azure Well-Architected Monitoring, MITRE ATT&CK.
