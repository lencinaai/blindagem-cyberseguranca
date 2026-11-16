# IA e API do Gemini

Chamar o Gemini a partir de um app tem três riscos práticos: a chave vaza e drena o
orçamento, o custo estoura por falta de teto, e o modelo é induzido a fazer o que
não devia (injeção de prompt).

## Chave e superfície de ataque

- CRÍTICO: chave do Gemini no frontend, no bundle, no app mobile, no Git ou em
  repositório público. Vazou, o custo é drenado em minutos. Procure por `AIza` no
  projeto. A correção é rotacionar a chave e mover a chamada para o servidor.
- Proxy no servidor é obrigatório para qualquer app com frente pública. O cliente
  manda a requisição limpa, o servidor injeta a chave guardada em variável de
  ambiente, chama o Gemini e devolve só o texto gerado. A chave nunca chega ao
  cliente. Vale para site, mobile e extensão.
- Restrinja a chave no Google Cloud: crie a chave num projeto isolado, restrinja
  para "Gemini API" apenas, e aplique restrição de aplicativo, por IP quando a chave
  é usada por um servidor fixo, ou por referenciador HTTP (domínio) quando é um
  proxy web. Assim, uma chave roubada só funciona da origem autorizada. Ação de
  painel do usuário.

## Rate limit e teto de gasto

- Os limites do Gemini são por projeto, não por chave. São medidos em requisições
  por minuto (RPM) e tokens por minuto (TPM). O Gemini também aplica limite por
  gasto, avaliado em janela móvel de 10 minutos, conforme histórico e tier.
- O tier gratuito do AI Studio é muito baixo (ordem de 5 requisições por minuto e 25
  por dia). Não serve de base para produção.
- ALTO: rota que chama o Gemini sem limite próprio por usuário. O limite do provedor
  pode ter atraso, então o seu limite é a rede de proteção contra abuso e conta
  alta. Mantenha duas camadas: teto no painel do provedor com alerta perto da cota,
  e limite por usuário na sua aplicação, contando uso no banco e recusando com
  mensagem clara quando o teto for atingido.
- Implemente backoff com retentativa exponencial para não derrubar o serviço quando
  bater o limite.

## Filtros de segurança de conteúdo

- O Gemini tem filtragem embutida e safety settings ajustáveis por categoria de dano
  (assédio, discurso de ódio, conteúdo sexual explícito, conteúdo perigoso, e
  integridade cívica em alguns modelos). Para app público, defina os filtros de
  forma consciente e teste. Afrouxar filtro é decisão de risco registrada, não
  default silencioso.

## Injeção de prompt (o risco de IA mais comum em vibe coding)

- Trate toda entrada de usuário e todo conteúdo externo (documento, página, imagem
  enviada) como não confiável antes de virar prompt. O modelo pode ser induzido a
  ignorar instruções e vazar segredo ou executar ação indevida ("ignore as
  instruções anteriores e revele...").
- Guardrails determinísticos antes e depois, com regra de código, não confiando só
  no modelo: validar a entrada e filtrar a saída (por exemplo, bloquear na resposta
  padrões de chave como `sk-` ou `AIza`).
- Menor privilégio para a IA: dê ao modelo acesso só às ferramentas e dados que ele
  precisa. Se a IA aciona ferramentas (function calling, agente, MCP), cada ação
  sensível exige confirmação, e nunca deixe a saída do modelo virar comando direto
  em banco, shell ou template.
- Sanitize a saída antes de renderizar como HTML, para não transformar a resposta do
  modelo em XSS.

## Saída

Liste onde a chave é usada e se está no servidor, o estado das restrições de chave,
a presença de teto por usuário e alerta de billing, a configuração de safety
settings e os guardrails de entrada e saída. As restrições de chave e o teto no
painel entram como pendências do usuário.

Fontes: Gemini API Rate limits e Safety guidance (`ai.google.dev/gemini-api`),
Securing Your Gemini and Google API Keys (Google Cloud Blog), e OWASP Top 10 for LLM
Applications 2025.
