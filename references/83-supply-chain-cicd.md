# Cadeia de suprimentos, CI/CD e artefatos

O ataque não precisa mirar você direto: pode entrar por uma dependência, por uma
Action do GitHub ou pelo pipeline. Log4Shell mostrou o tamanho do risco.

## Dependências

- Varra dependências por vulnerabilidade conhecida (ver
  `references/70-ferramentas-varredura.md`) e corrija o explorável, retestando.
- Use dependência de fonte confiável e oficial. Minimize a quantidade; cada pacote é
  superfície de ataque. Para risco maior, Snyk ou Socket.dev detectam pacote
  malicioso, não só vulnerável.
- Fixe versão (lockfile) para reprodutibilidade. Ative o Dependabot.

## CI/CD e GitHub Actions

- Permissões mínimas no workflow (`permissions:` explícito). Segredo do CI por
  ambiente, não global.
- Cuidado com pull request de fonte não confiável: não dê segredo nem execução
  privilegiada a PR externo (o evento `pull_request_target` é o pé na porta).
- Fixe as Actions por SHA de commit, não por tag móvel, para uma tag repontada não
  trocar o que roda.
- Prefira OIDC para deploy, em vez de chave estática guardada no CI.
- Ative secret scanning e push protection no repositório, para segredo não entrar no
  histórico.

## Portão de release e proveniência

- O gate de CI não pode ficar verde com falha da ferramenta. Evite `|| true` nos
  scanners; separe o status e defina a política de bloqueio.
- Para maturidade, gere SBOM (lista de materiais do software) e proveniência do
  artefato (SLSA), para saber exatamente o que foi construído e a partir de quê.
- Branch principal protegida. Deploy liga commit imutável, revisores, testes e
  artefato verificado.

## Saída

Liste dependências vulneráveis ou maliciosas, permissões amplas no CI, Actions não
fixadas, segredo no pipeline, e ausência de gate real. Referências: SLSA 1.2, CISA
SBOM 2025, OpenSSF, documentação de segurança do GitHub Actions.
