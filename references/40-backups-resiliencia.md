# Backup, resiliência, rate limit e teto de gasto

Backup é segurança: é o que traz a aplicação de volta depois de ransomware, erro ou
ataque. Rate limit e teto de gasto são o que impedem que abuso vire conta impagável
ou serviço derrubado.

## Backups e recuperação

- Backup automático do Firestore: exportações agendadas para um bucket separado, de
  preferência em conta ou projeto isolado, para que o comprometimento do principal
  não alcance o backup.
- Backup do código em repositório privado, e das variáveis de ambiente e configuração
  guardadas cifradas.
- Regra 3-2-1 como ponto de partida: três cópias, dois meios, uma fora do local
  principal. Mas 3-2-1 não prova nada sozinho. O que prova é o teste de restauração.
- CRÍTICO na prática: backup que nunca foi restaurado é esperança, não backup. Teste
  a restauração periodicamente, meça quanto tempo leva e confirme a integridade.
- Defina RPO e RTO: quanto de dado você aceita perder, e em quanto tempo precisa
  voltar. Para dado crítico, considere cópia imutável ou offline, protegida contra
  alteração e exclusão.
- Retenção com ciclo de vida: backup não é eterno. Alinhe retenção com a LGPD (ver
  `references/50-lgpd-privacidade.md`).

## Rate limit

- ALTO: rota sensível sem rate limit. Login, reset de senha, rotas de IA, envio de
  e-mail e pagamento são alvo de força bruta, scraping, abuso de custo e DDoS.
- O contador fica sempre no servidor, nunca no cliente, porque o contador do cliente
  é editável. Limite por IP e por usuário. Responda 429 quando estourar.
- Na borda, a Cloudflare faz rate limit de rede, que complementa o rate limit lógico
  da aplicação.

## Teto de gasto (budget cap)

- Alertas de billing em Vercel, Firebase, Cloudinary e Gemini. Gasto que dispara é o
  primeiro sinal de abuso ou de chave vazada.
- Teto de orçamento onde o provedor permitir, para cortar o serviço antes da conta
  virar um susto. Vale contra chave vazada, loop de IA e ataque de volume.
- No Gemini, mantenha também o teto por usuário na aplicação (ver
  `references/21-ia-gemini.md`), porque o limite do provedor pode ter atraso.

## Cloudflare: WAF, bot e anti-scraping (borda)

A Cloudflare é a camada de borda. Bloqueio simples por IP e `robots.txt` não param
atacante sério, então use os recursos reais:

- WAF ligado com regras gerenciadas.
- Rate limiting de borda nas rotas sensíveis e nos formulários.
- Proteção de bot. Contra scraping, as defesas que funcionam são comportamentais e
  criptográficas: impressão digital de TLS, desafios invisíveis como o Turnstile, e
  armadilhas honeypot (campos e rotas ocultos por CSS que só um bot preenche).
- Cache das páginas públicas, que reduz carga e absorve picos.
- Modo "Under Attack" como botão de pânico.

Tudo isso é ação de painel do usuário na Cloudflare. Descreva o passo a passo.

## Monitoramento e alertas

- Monitor de uptime (UptimeRobot ou similar).
- Logs das funções e do Cloudflare com alerta para picos de 401, muitos webhooks
  rejeitados, cadastros em massa. Nunca logue senha, token, secret ou dado sensível.

## Saída

Registre a situação de backup (existe, é isolado, foi restaurado com teste), rate
limit nas rotas sensíveis, tetos e alertas de billing, e a configuração da
Cloudflare. As ações de painel entram como pendências do usuário.
