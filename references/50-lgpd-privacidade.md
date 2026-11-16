# LGPD e privacidade

Blindagem técnica sem conformidade legal deixa um flanco aberto. No Brasil, a LGPD
trata dados pessoais com regras que valem mesmo para um SaaS pequeno, e a sanção por
falha grave chega a multa relevante além do dano de imagem. Esta referência mapeia
fatos e fontes; ela não substitui parecer jurídico. Casos com dado sensível, setor
regulado ou transferência internacional podem exigir profissional habilitado.

## Privacidade desde a concepção

- Minimização: colete só o dado essencial à operação. Dado que você não guarda não
  vaza. Cada campo coletado ou devolvido precisa de finalidade documentada.
- Finalidade e base legal: cada dado tem uma razão. Quando a base é consentimento,
  ele precisa ser livre, informado, específico e revogável com a mesma facilidade do
  aceite. Formulário de lead e cadastro precisa de aviso e aceite reais, sem dark
  pattern onde recusar é mais difícil que aceitar.
- Criptografia: em trânsito (HTTPS) e em repouso (o Firestore já cifra em repouso).
- Controle de acesso por papel: só o dono vê os próprios leads; só o administrador vê
  o painel master. Isso é a mesma autorização das regras do Firestore.
- Retenção e exclusão: permita que o usuário apague conta e dados. Defina por quanto
  tempo cada dado é guardado, e propague a exclusão a banco, storage, cache, backups
  (conforme o ciclo) e provedores.
- Anonimização em logs: nunca registre dado pessoal, senha, token ou secret em texto
  puro.

## Documentos e papéis

- Política de privacidade publicada e acessível, que reflita o comportamento real do
  sistema.
- Aviso de cookies se houver rastreamento, com opção de recusar os não essenciais
  antes de coletar.
- Registro das operações de tratamento: quais dados, para quê, por quanto tempo.
- Encarregado (DPO): a indicação nem sempre é obrigatória. Pela Resolução ANPD 2/2022,
  agentes de tratamento de pequeno porte podem ter dispensa da indicação formal,
  mantendo um canal de comunicação com o titular. Avalie o enquadramento do caso
  concreto, não presuma que o dono precisa ser DPO nem que a indicação é sempre
  obrigatória.
- RIPD (relatório de impacto): pode ser exigido em tratamento de alto risco, como
  IA, biometria, dados de crianças ou larga escala. Avalie o gatilho.

## Saída

Registre o estado da conformidade: política de privacidade existe e bate com o
sistema, consentimento válido nos formulários, fluxo de exclusão de conta,
minimização, registro de tratamento e enquadramento do encarregado. As lacunas viram
achados de gravidade MÉDIO a ALTO conforme o volume e a sensibilidade dos dados.
Marque como "precisa verificação" o que depende de decisão jurídica.

Fontes: LGPD (Lei 13.709/2018), Resoluções ANPD 2/2022 e 15/2024, e guias da ANPD
para agentes de pequeno porte e para cookies.
