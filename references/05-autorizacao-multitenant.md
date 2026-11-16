# Autorização e isolamento entre usuários (multi-tenant)

Autorização é o controle mais violado em APIs modernas. Para as regras do Firestore,
ver `references/11-firestore-regras.md`. Aqui está o princípio geral, válido para
qualquer banco e API.

## Deny por padrão e mediação completa

- Toda ação é autorizada no servidor, para o sujeito, o objeto, a propriedade, a
  função e o tenant. Ausência de regra nega. O frontend nunca é autoridade.
- IDs opacos ou aleatórios ajudam, mas não substituem a checagem de autorização.

## As falhas de autorização (OWASP API Top 10)

- BOLA / IDOR (API1): a rota recebe um id e devolve o registro sem checar se o
  solicitante é o dono. Corrija validando posse em toda chamada.
- BFLA (API5): uma função administrativa aceita chamada de usuário comum. Cada
  função verifica o papel, não só se está logado.
- BOPLA / atribuição em massa (API3): grava ou devolve campos que não deveria. Use
  allowlist de campos graváveis e retornáveis. Um atacante manda `role: admin`
  escondido; a allowlist barra.
- Elevação de privilégio horizontal (ver dado de outro usuário) e vertical (virar
  admin).

## Isolamento multi-tenant (o vazamento entre clientes)

Quando o app serve várias empresas ou muitos usuários, o tenant precisa fazer parte
da política e da chave de particionamento em todas as camadas, não só na tela:

- Consultas limitadas ao tenant ou ao dono, sempre no servidor. O contexto não vem
  de parâmetro controlado pelo cliente.
- O tenant tem que ser preservado também em: cache (não compartilhe chave de cache
  entre tenants), fila e job assíncrono (o contexto se perde e vaza), busca e RAG,
  exportação e relatório, e log.
- Suporte administrativo que acessa dado de cliente é explicitamente mediado e
  auditado.

## Modelos de autorização

RBAC (por papel), ABAC (por atributo) e ReBAC (por relação). Escolha o mais simples
que resolve. O importante é a checagem estar no servidor e ser testada.

## Como testar (matriz negativa)

Não basta o caminho feliz. Teste com pelo menos dois usuários, dois papéis e dois
tenants, e prove que:

- Usuário A não lê nem escreve o recurso de B.
- Usuário comum não chama a função de admin.
- O tenant X não vê nada do tenant Y, inclusive em busca, exportação e cache.

Cada teste negativo que passar (operação proibida que foi permitida) é falha ALTO a
CRÍTICO.

## Saída

Matriz papel-ação-recurso, resultado dos testes negativos, e onde a autorização é
feita. Referências: OWASP API Top 10:2023, OWASP ASVS 5.0.0, NIST SP 800-207 (Zero
Trust).
