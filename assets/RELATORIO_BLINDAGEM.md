# Relatório de Blindagem de Segurança

- Projeto: [nome]
- Data: [data]
- Responsável pela revisão: [Claude / nome]
- Commit e ambiente revisados: [hash do commit, produção ou staging]
- Stack detectada: [Vercel, Firebase, Firestore, Cloudinary, Cakto, Apps Script, Gemini, ...]
- Veredito: [nível de garantia no escopo. Ex.: "Sem crítico nem alto confirmado em
  aberto no código revisado; 3 itens dependem de verificação no painel." Não usar
  "blindado" como afirmação absoluta.]

## Resumo executivo

Uma frase por número: quantas falhas confirmadas por gravidade, quantas corrigidas,
quantas dependem de ação do usuário, quantas precisam de verificação, e o veredito.
Não misture hipótese com falha confirmada.

| Gravidade | Confirmadas | Corrigidas | Em aberto | Precisa verificação |
|---|---|---|---|---|
| Crítico | | | | |
| Alto | | | | |
| Médio | | | | |
| Baixo | | | | |

## Catálogo de falhas

Para cada falha, uma entrada. Mantenha a ordem por gravidade.

### [ID] [Título curto da falha]

- Gravidade: [Crítico/Alto/Médio/Baixo]
- Confiança: [Confirmado / Alta confiança / Precisa verificação / Hardening]
- Camada: [Firestore / API / Frontend / Segredos / Pagamento / IA / Apps Script / LGPD / ...]
- Onde: [arquivo:linha ou painel/serviço]
- Impacto em linguagem comum: [o que pode dar errado na prática, para o dono]
- Evidência e correção técnica: [o que prova a falha, e o que mudou no código ou o
  passo a passo para o usuário]
- Rastreabilidade: [qual ameaça ou risco de negócio a correção mitiga, e qual comando
  ou teste comprova que continua mitigado]
- Evidência do reteste: [comando rodado e resultado que prova o conserto]
- Status: [Corrigida | Pendente no usuário | Precisa verificação | Aceita como risco residual]

## Ações pendentes no usuário (painéis)

Coisas que só o usuário pode fazer, com passo a passo. Nenhuma some até resolver.

| Ação | Onde | Gravidade | Prazo sugerido | Status |
|---|---|---|---|---|
| Ativar 2FA | Google, Vercel, Cloudflare, GitHub, Cakto | Crítico | hoje | |
| Rotacionar chave [X] exposta | painel do serviço | Crítico | hoje | |
| Restringir chave do Gemini (IP/domínio) e teto de gasto | Google Cloud | Alto | esta semana | |
| Ligar App Check | Firebase Console | Médio | esta semana | |
| Configurar WAF e rate limit | Cloudflare | Médio | esta semana | |
| Publicar política de privacidade | site | Médio | este mês | |

## Itens que precisam de verificação

O que depende de configuração de painel, de lógica de negócio ou de estado de
produção que não dá para confirmar só pelo código. Cada item vira uma pergunta ao
usuário, não uma afirmação de falha.

## Risco residual aceito

O que não foi corrigido e por quê (custo, baixo impacto, limitação técnica). Cada
item com a justificativa e o aceite do usuário.

## Reteste final

Resultado da varredura completa rodada de novo ao fim do ciclo.

| Varredura | Resultado |
|---|---|
| Dependências (npm audit / osv-scanner) | |
| Segredos (gitleaks / trufflehog) | |
| Regras do Firestore (emulador) | |
| SAST (semgrep) | |
| Headers e CSP (URL publicada) | |
| Webhook Cakto (secret errado no corpo = 401; id repetido não processa) | |
| DAST leve (nuclei, se aplicável) | |

## Limitações e validade

- O que não foi coberto nesta revisão (domínios sem referência, estado de painel não
  verificado, lógica de negócio não confirmada).
- Validade: a revisão vale para este commit e ambiente. Reavaliar após mudança
  significativa (nova rota, novo fluxo de pagamento, nova coleção de dados pessoais).

## Próxima revisão recomendada

[data] ou após mudança significativa.
