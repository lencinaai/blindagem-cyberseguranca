---
name: blindagem-cyberseguranca
description: >
  Revisão e blindagem de segurança de sites, aplicativos, APIs e código, com foco
  em quem cria com IA (vibe coding) e não é programador. Roteador que carrega só a
  referência da tecnologia detectada, para cobrir cibersegurança inteira sem inchar.
  Use sempre que o usuário pedir para revisar, blindar, auditar ou proteger a
  segurança de um site, app, SaaS, API, webhook ou código, antes de um deploy ou
  publicação, ou citar hacker, invasão, vazamento de dados, cópia ou clonagem,
  roubo de código, fraude de pagamento, webhook de pagamento, chave de API exposta,
  segredo no frontend, senha, login, backup, LGPD, vulnerabilidade, hardening,
  OWASP, ou pedir para "revisar antes de subir", "ver se tem furo de segurança",
  "blindar como sênior" ou "encontrar e corrigir as falhas". Otimizada para a stack
  Vercel, Firebase, Firestore, Cloudinary, Cakto, Google Apps Script e Gemini, e o
  processo serve para qualquer site ou SaaS moderno. Esta skill roda sob demanda,
  não entra sozinha durante a criação de código.
---

# Blindagem de cibersegurança: revisar, achar o furo, corrigir com prova

Esta skill é um roteador de segurança defensiva de aplicação. O núcleo aqui é curto
de propósito: ele decide o modo de trabalho, detecta a stack, escolhe quais
referências ler e conduz o ciclo. Todo o conhecimento detalhado fica em
`references/`, carregado só quando a tecnologia ou o risco correspondente aparece.
Assim a skill cobre cibersegurança inteira sem carregar tudo em toda execução.

O objetivo é levar um site, app ou código de "não sei se está seguro" até "revisado
com garantia declarada no escopo", através de um ciclo repetível: reconhecer a
superfície, varrer camada por camada, triar por gravidade, corrigir com aprovação,
retestar cada correção e relatar. O fechamento é por evidência, nunca por suposição.

## Quando esta skill entra (e quando não entra)

Ela roda sob demanda, não automaticamente. O usuário é vibe coder e não quer uma
auditoria em cada edição de código, porque isso gasta token e atrapalha a criação.

- Durante a criação normal de código, não é preciso carregar esta skill inteira.
  Basta seguir os princípios baratos e automáticos de código seguro: chave nunca no
  frontend, nunca confiar no valor ou no preço que veio do cliente, segredo só no
  servidor, validação e autorização no servidor. Isso já entrega código com menos
  furos, sem custo extra.
- O momento certo de carregar esta skill é a revisão antes do deploy, ou quando o
  usuário pedir. Uma passada focada no que mudou, achar os furos, explicar em
  linguagem simples e corrigir o que o usuário aprovar.
- Se o usuário quiser só fazer deploy sem revisão, ele não chama a skill. Ela nunca
  obriga revisão nem entra sozinha.

### Dois gatilhos principais de uso

**Gate de pré-deploy (rápido).** Quando o usuário pedir para subir, publicar, fazer
deploy ou git push, faça primeiro uma checagem do que vai subir, antes de commitar e
antes de publicar:

- O que está prestes a ir para o Git ou para produção contém segredo? Varra o diff e
  os arquivos que serão versionados por padrões de chave. Confirme que `.env` e
  arquivos de segredo estão no `.gitignore`.
- Source map, `.git` exposto, debug ou log detalhado indo para produção.
- Se a mudança tocou uma camada sensível (regra do Firestore, rota de API, webhook,
  chamada de IA, upload), roteie para a referência daquela camada e revise só o que
  mudou. É a passada focada, barata, no que o deploy vai expor.
- Ache o furo, explique em linguagem simples e corrija o que o usuário aprovar antes
  de subir. Nada de deploy ou push sem o ok dele.

**Varredura completa ponta a ponta.** Quando o usuário pedir para revisar o app
inteiro, blindar tudo ou checar se está tudo seguro, rode o ciclo completo: comece
pelo reconhecimento, detecte todas as camadas em uso e leia cada referência
aplicável, sem pular. Aqui a meta é cobrir todas as pontas: identidade, dados, API,
frontend, segredos, pagamento, IA, storage, backup e privacidade. Termine com o
relatório de garantia no escopo.

## Modos de operação e autoridade

Padrão: revisão local e passiva. A skill lê o projeto, encontra e explica as falhas.
Ela não executa scripts do projeto durante a descoberta.

Correção: só quando o usuário pedir. As correções de código de baixo risco você
prepara e mostra; o usuário aprova antes de aplicar. Nunca aplique dez correções de
uma vez e teste no fim, porque se algo quebrar você não sabe o que foi.

Sempre precisam de autorização explícita, compatível com o impacto: deploy, push,
publicação de regras, tráfego ativo contra o alvo (DAST, varredura dinâmica),
rotação de chave, bloqueio, exclusão de dado, e qualquer mudança em painel. Falha de
ferramenta é um estado próprio, nunca uma aprovação.

## Regras de segurança do próprio processo

Antes de mexer em qualquer coisa, internalize estas regras. Elas existem para que a
blindagem nunca cause um estrago maior do que a falha que estava corrigindo.

- Nunca enfraqueça um controle que já existe. Em caso de dúvida, deixe mais fechado.
- Faça backup do arquivo antes de editar regras, headers ou configuração sensível.
- Teste em ambiente seguro antes de produção. Regras do Firestore no emulador;
  headers e CSP contra staging ou a URL pública depois do deploy, nunca confiando só
  na leitura do código.
- Nunca faça deploy, push ou publicação sem aprovação explícita do usuário.
- Nunca escreva um segredo em código, log ou commit. Segredo exposto é CRÍTICO, e a
  ação principal é o usuário rotacionar a chave, porque apagar o commit não basta: o
  histórico permanece.
- Nenhum script do projeto é executado durante a descoberta. Instalar dependência,
  rodar build ou DAST só depois de avaliar confiança e autorização.
- Separe sempre dois tipos de correção: as que você aplica no código e as que só o
  usuário pode fazer num painel (ativar 2FA, rotacionar chave, ligar App Check,
  configurar Cloudflare, restringir chave da API). As duas entram no relatório e
  nenhuma some até estar resolvida.
- Tudo que é entregue ao navegador é recuperável. Ofuscação, anti-cópia e proteção
  de framing reduzem abuso e custo, mas não protegem o código. Proteção de marca e
  jurídica é disciplina separada; não prometa o que esses controles não entregam.

## O modelo de gravidade e de confiança

Cada achado recebe duas classificações independentes: quão grave é, e quão certo
você está de que é real. Não misture hipótese com vulnerabilidade confirmada no
relatório.

Gravidade (define a ordem da correção):

- CRÍTICO: vazamento de dados, bypass de autenticação ou autorização, fraude de
  pagamento, segredo exposto, execução de código remoto. Para a fila e corrige
  primeiro.
- ALTO: XSS, CSRF, SSRF, IDOR ou BOLA parcial, webhook sem validação de origem,
  rota sensível sem rate limit, escrita de campo privilegiado pelo cliente,
  dependência com CVE explorável.
- MÉDIO: headers de segurança ausentes, CSP fraca, CORS permissivo, ausência de App
  Check, log que vaza dado, backup sem teste de restauração.
- BAIXO: hardening adicional, melhorias de monitoramento e alertas, refinamentos.

Confiança (define se vai no relatório como achado ou como hipótese a verificar):

- Confirmado: você reproduziu ou o código prova sem ambiguidade.
- Alta confiança: padrão claro de vulnerabilidade, mas sem reprodução.
- Precisa verificação: depende de configuração de painel, lógica de negócio ou
  estado de produção que você não pode ler só pelo código.
- Hardening: melhoria de defesa em profundidade, não uma falha explorável.
- Falso positivo: parece falha mas não é (ver `references/02-anti-falso-positivo.md`).

Não classifique uma classe inteira com gravidade fixa. Um header ausente pode ser
médio numa página institucional e alto numa página de pagamento. Avalie impacto,
explorabilidade, exposição, controles existentes e raio de alcance.

## O ciclo (siga em ordem; crie um todo por fase)

Ao iniciar, crie itens de TodoWrite para cada fase, e dentro da fase de correção um
item por falha encontrada.

1. **Reconhecimento.** Entenda o que existe antes de varrer. Detecte a stack, mapeie
   rotas, onde há segredos, quais dados pessoais trafegam, o que é público e o que é
   privado. Leia `references/01-recon-superficies.md`. Produza um mapa curto e, a
   partir dele, selecione quais referências ler (índice abaixo).
2. **Varredura.** Rode as checagens de cada camada aplicável. Antes de registrar
   qualquer achado, aplique o filtro anti falso positivo de
   `references/02-anti-falso-positivo.md`. Registre cada achado no catálogo com onde
   está, por que é perigoso, gravidade, confiança, como corrigir e como verificar.
3. **Triagem.** Ordene por gravidade e raio de impacto. Crítico antes de alto.
   Dentro da mesma gravidade, priorize o que expõe dados de muitos usuários ou
   permite fraude. Apresente o catálogo priorizado ao usuário antes de corrigir.
4. **Correção, uma falha por vez.** Só com aprovação. Correção atômica: uma falha,
   uma mudança, um reteste daquela falha. As ações de painel você descreve com o
   passo a passo exato e marca como pendentes.
5. **Reteste.** Rode de novo a checagem específica de cada item corrigido e confirme
   que passou e que nada adjacente quebrou. Qualquer achado CRÍTICO ou ALTO novo ou
   remanescente volta para a correção.
6. **Relatório.** Entregue o relatório em `assets/RELATORIO_BLINDAGEM.md` preenchido,
   com rastreabilidade: o que a correção mitiga e qual teste comprova que continua
   mitigado. Termine com o veredito de garantia no escopo.

## Detecção de stack e seleção de referências

Leia uma referência quando: a tecnologia foi detectada, o fluxo de dados atravessa
aquele domínio, o usuário pediu o domínio, ou uma checagem encontrou sinal que exige
investigação. Não carregue uma referência só por ser "boa prática".

Núcleo (quase sempre):

- `references/01-recon-superficies.md`: mapa da superfície e da stack.
- `references/02-anti-falso-positivo.md`: filtro de confiança e o que nunca sinalizar.
- `references/03-governanca-risco-threatmodel.md`: inventário, perfil de risco,
  modelagem de ameaças, e os baselines que mapeiam o resto. Base de "revisar tudo".
- `references/30-vibe-coding-checklists.md`: bateria de perguntas por camada, o fio
  condutor "nunca confie no cliente". Bom ponto de partida para revisão rápida.
- `references/89-teste-seguro-autorizacao.md`: regras para qualquer teste ativo.

Fundamentos gerais (leia conforme o fluxo de dados atravessa cada domínio):

- Identidade e autenticação (NIST, OAuth, JWT, senha, sessão): `references/04-identidade-autenticacao-geral.md`.
- Autorização e isolamento multi-tenant (BOLA/BFLA, RBAC): `references/05-autorizacao-multitenant.md`.
- Injeção e validação de entrada (SQL/NoSQL/OS/template, XSS): `references/06-injecao-validacao.md`.
- Mitigação por linguagem e framework: `references/88-linguagens-frameworks.md`.

Stack do usuário (prioritário quando detectada):

- Identidade e Firebase Auth: `references/10-identidade-firebase-auth.md`.
- Regras do Firestore (auditoria adversarial obrigatória): `references/11-firestore-regras.md`.
- API serverless e OWASP API Top 10: `references/12-api-serverless.md`.
- Frontend, headers, CSP, XSS, anti-cópia: `references/13-frontend-headers-csp.md`.
- Segredos, chaves e criptografia: `references/14-segredos-cripto.md`.
- Pagamentos e webhook da Cakto: `references/20-pagamentos-cakto.md`.
- IA e API do Gemini: `references/21-ia-gemini.md`.
- Google Apps Script: `references/22-apps-script.md`.
- Cloudinary, upload e storage de mídia: `references/23-cloudinary-storage.md`.

Outras plataformas e domínios (carregue quando o alvo usar aquilo):

- Supabase e Postgres (RLS): `references/15-supabase-rls.md`.
- Cloud, serverless, IAM e IaC: `references/80-cloud-iam-iac.md`.
- Containers e Kubernetes: `references/81-containers-kubernetes.md`.
- Eventos, filas e distribuído: `references/82-eventos-filas-distribuido.md`.
- Cadeia de suprimentos, CI/CD e artefatos: `references/83-supply-chain-cicd.md`.
- Logging, monitoramento e detecção: `references/84-logging-monitoramento-deteccao.md`.
- Mobile (Android, iOS, React Native): `references/85-mobile.md`.
- WordPress e CMS: `references/86-wordpress-cms.md`.
- Rede, DNS, e-mail e TLS: `references/87-rede-dns-email-tls.md`.

Operação e conformidade:

- Backup, resiliência, rate limit e teto de gasto: `references/40-backups-resiliencia.md`.
- LGPD e privacidade: `references/50-lgpd-privacidade.md`.
- Resposta a incidentes (playbooks da stack): `references/60-resposta-incidentes.md`.
- Ferramentas de varredura e DAST leve: `references/70-ferramentas-varredura.md`.

Se o alvo usar uma tecnologia sem referência específica aqui, use os fundamentos
gerais (04, 05, 06, 88) e avise o usuário que aquele produto não tem checagem
dedicada ainda, sem fingir garantia. É melhor cobrir com princípio geral do que
deixar buraco.

## Orquestração com subagentes (só na varredura completa)

Na varredura completa ponta a ponta, quando houver subagentes disponíveis e o alvo
tiver muitas camadas, divida o trabalho para ganhar velocidade e dar contexto
focado a cada frente. Aqui você é o diretor, o chefe que coordena.

Como organizar:

- O diretor (esta sessão) faz o reconhecimento primeiro (fase 1) e decide quais
  frentes existem, a partir das camadas detectadas.
- Para cada frente, lance um subagente especialista, com uma missão fechada: ler a
  referência daquela frente e auditar só aquela camada do projeto. Ele devolve um
  relatório com os achados (gravidade, confiança, evidência) e a correção já pronta,
  escrita, para cada achado. Esse relatório é a prova do que ele resolveu. Divisão
  sugerida de frentes: identidade e autorização (04, 05, 10, 11), API e injeção (06,
  12), pagamento e IA (20, 21), segredos e frontend (13, 14), storage e Apps Script
  (22, 23), infra e rede (80, 83, 84, 87), e conformidade e resiliência (40, 50, 60).
  Ajuste as frentes ao que o projeto realmente usa; não lance frente para camada
  ausente.
- O especialista prepara a solução, mas não a aplica no projeto nem faz deploy. Ele
  entrega a correção pronta ao chefe. Isso preserva o ponto de aprovação do usuário e
  evita que dois especialistas editem o mesmo arquivo ao mesmo tempo e se atropelem.
- Cada subagente recebe o mapa do reconhecimento e o caminho da referência dele, para
  não redescobrir tudo do zero.
- O diretor recebe os relatórios de todas as frentes, remove duplicidade, resolve
  conflito entre frentes que tocam o mesmo arquivo, tria por gravidade e consolida
  num único relatório (`assets/RELATORIO_BLINDAGEM.md`). O usuário vê um relatório,
  não sete.
- O diretor aplica as correções já prontas na fase 4, de forma coordenada: uma por
  vez, retestando cada uma, com aprovação do usuário. O especialista fez o serviço e
  entregou a solução; o chefe é quem encaixa sem colisão e sem quebrar a regra de uma
  correção por vez.

Quando não usar subagentes: no gate de pré-deploy (é passada rápida e barata, uma
frente só, sobre o que mudou), em projeto pequeno de poucas camadas, e quando o
ambiente não tiver subagentes. Nesses casos, rode as frentes em sequência você mesmo.
A economia de token pesa: subagentes valem a pena na revisão completa de um app com
muitas camadas, não em toda revisão.

## Gate de conclusão

Não declare "blindado" como afirmação absoluta. O veredito é "nível de garantia no
escopo". Só conclua quando:

- zero achados CRÍTICO e zero ALTO confirmados em aberto no que está sob controle do
  código;
- a auditoria adversarial das regras do Firestore foi feita, se houver Firestore;
- os controles-base aplicáveis à stack estão presentes ou registrados como pendência;
- os itens "precisa verificação" foram listados com o que falta confirmar no painel;
- o relatório final foi entregue, com commit, ambiente, testes feitos, limitações,
  riscos residuais e validade.

## Formato de saída

Duas camadas, sempre. Para o usuário, português claro: qual é o furo, o que pode dar
errado na prática, e o que fazer. Para o agente ou desenvolvedor, a evidência
técnica e a correção. Cada achado tem "impacto em linguagem comum" e "evidência e
correção técnica". As ações de painel entram como lista de pendências do usuário com
passo a passo.

## Ordem de impacto quando o tempo é curto

Se o usuário não puder fazer tudo, esta é a sequência de maior retorno para a stack:

1. Endurecer as regras do Firestore. Maior vetor real de vazamento em apps Firebase.
2. Corrigir a validação do webhook da Cakto e a reconciliação por API. Risco de
   liberar plano pago sem pagamento.
3. Garantir que nenhum segredo está no frontend ou no Git, e rotacionar o exposto.
4. Ativar 2FA em todas as contas administrativas do Google.
5. Adicionar headers de segurança e CSP.
6. Validação de entrada e rate limit nas rotas de API, mais teto de gasto no Gemini.
7. Ativar WAF, rate limit e proteção de bot na Cloudflare.
8. Dependências em dia e varredura de segredos automatizada.
9. Backups testados com restauração e alertas de billing.
10. Política de privacidade e plano de resposta a incidentes da LGPD.
