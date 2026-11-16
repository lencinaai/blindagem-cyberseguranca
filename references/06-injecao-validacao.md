# Injeção e validação de entrada

Injeção é impedir que dado vire comando ou código. É a classe número um do CWE Top 25
há anos. Vale para banco, sistema operacional, template, XML e navegador.

## Validação por schema e contexto

- Valide no limite confiável (servidor) tipo, formato, tamanho, faixa, enumeração e
  codificação de cada campo. Rejeite campos desconhecidos em operações sensíveis.
- Validação no cliente é só experiência de uso, nunca autoridade.

## Prevenção de injeção por API segura

- SQL e NoSQL: use query parametrizada, ORM ou query builder seguro. Nunca concatene
  entrada na consulta. O clássico `Robert'); DROP TABLE` só funciona com
  concatenação. No NoSQL e no Prisma, cuidado com operator injection (o cliente manda
  um objeto que vira operador de consulta).
- Comando de sistema operacional: evite chamar shell com entrada do usuário. Se
  precisar, use API que passa argumentos como lista, não como string concatenada.
- Template (SSTI): não injete entrada em template renderizado no servidor.
- LDAP, XPath e outros interpretadores seguem o mesmo princípio: parametrize ou faça
  escape específico do contexto.
- Processo roda com o menor privilégio possível, para conter o dano se algo passar.

## Desserialização e XML

- Não desserialize dado não confiável em objeto sem validação. Desabilite tipos
  polimórficos e propriedades desconhecidas.
- XML: desabilite entidades externas (XXE) e DTD quando não forem necessárias.

## XSS (saída no navegador)

- É injeção do lado do cliente. A defesa está na codificação de saída pelo contexto,
  e no auto-escape do framework (ver `references/13-frontend-headers-csp.md`).
- HTML rico passa por um sanitizador mantido, com allowlist. Conteúdo gerado por IA
  também é entrada não confiável e precisa ser sanitizado antes de virar HTML.

## Como testar (defensivo, não destrutivo)

- SAST com regras de taint (Semgrep, ver `references/70-ferramentas-varredura.md`)
  para achar onde entrada chega a um sink perigoso.
- Testes negativos com caracteres de controle sintéticos, provando que a entrada é
  tratada como dado, não como comando. Nunca use carga ofensiva real contra produção.

## Saída

Liste cada sink onde entrada do usuário alcança interpretador, arquivo ou comando,
com gravidade. Referências: OWASP ASVS 5.0.0 (Injection), CWE-89, CWE-78, CWE-94,
CWE-79, CWE Top 25:2025.
