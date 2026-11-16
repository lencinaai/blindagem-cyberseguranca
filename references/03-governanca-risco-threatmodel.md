# Governança, risco e modelagem de ameaças

Antes de varrer código, entenda o que precisa ser protegido e do quê. Esta
referência entra em revisão ampla, sistema novo ou quando o usuário quer cobrir
tudo. Ela é o eixo de "cibersegurança inteira": os padrões abaixo mapeiam o resto.

## Inventário e criticidade

- Todo ativo em produção precisa de dono, finalidade, criticidade, classificação de
  dados, exposição (público ou interno) e dependências. Ativo órfão e endpoint
  esquecido são a porta que ninguém fecha.
- Reconcilie o inventário com o que existe de verdade: DNS, provedor de cloud,
  repositórios, rotas. O que está no ar e não está no inventário é o maior risco.

## Perfil de risco

Nem todo app precisa do mesmo rigor. O nível de controle vem do risco, não de um
checklist universal cego. Sobem a prioridade: exposição pública, dado pessoal ou
sensível, privilégio administrativo, multi-tenant, pagamento, saúde, crianças, e
ação autônoma de IA com ferramentas.

## Modelagem de ameaças

Falha de desenho e de lógica de negócio não aparece em scanner. Antes do primeiro
lançamento e após mudança material, responda em prosa curta:

- Quais são os fluxos de dados e as fronteiras de confiança (onde o dado sai do seu
  controle e entra no do usuário ou de um terceiro).
- Quais entradas e operações são privilegiadas.
- Quais casos de abuso existem: como alguém ganharia acesso, dinheiro ou dado sem
  direito. Cupom em cima de cupom que zera a compra, criar conta e ganhar crédito de
  novo, trocar um id para ver dado alheio.
- Para cada ameaça, ligue prevenção, detecção, resposta e o teste que comprova.

## Baselines de referência (não copie a norma inteira, use como catálogo)

- OWASP Top 10:2025 para consciência de risco. É mapa, não checklist suficiente.
- OWASP ASVS 5.0.0 como catálogo de requisitos verificáveis de aplicação web.
- OWASP API Security Top 10:2023 para APIs.
- NIST CSF 2.0 para o ciclo de governança (Identificar, Proteger, Detectar,
  Responder, Recuperar, e a função Governar).
- CIS Controls 8.1 para priorização organizacional.
- CWE Top 25:2025 para as classes de fraqueza mais comuns.
- Para o Brasil, LGPD e ANPD (ver `references/50-lgpd-privacidade.md`).

O nível aplicável vem do perfil de risco. Escolha e congele por versão o baseline que
faz sentido para o alvo, justifique inclusões e exclusões, e transforme cada item
aplicável em teste e evidência.

## Saída

Um mapa curto: ativos, dados, fronteiras, casos de abuso, e quais referências desta
skill carregar em seguida. Este mapa é o que orienta o roteamento da varredura.
