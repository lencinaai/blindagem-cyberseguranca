# Containers e Kubernetes

Container e Kubernetes trazem risco na imagem, no runtime e no controle de acesso do
cluster. A maioria dos apps desta stack é serverless e não usa isto, então carregue
esta referência só se houver Docker, Compose ou Kubernetes no projeto.

## Imagem

- Base mínima e atualizada (distroless ou slim). Cada pacote a mais é superfície.
- Não coloque segredo na imagem nem no `Dockerfile`. Segredo entra em runtime, por
  secret manager ou variável do orquestrador.
- Varra a imagem por vulnerabilidade conhecida (OSV-Scanner e afins fazem `scan
  image`).
- Rode como usuário não root. Sistema de arquivos somente leitura quando possível.

## Runtime e Kubernetes

- Pod Security: sem privilégio, sem `hostPath` desnecessário, capacidades reduzidas,
  `readOnlyRootFilesystem`, sem escalonamento de privilégio.
- RBAC do cluster com menor privilégio. Ninguém é `cluster-admin` por padrão.
- Rede segmentada com NetworkPolicy: pod só fala com quem precisa.
- Admission control (policy) para barrar manifesto inseguro antes de subir.
- `etcd` cifrado e protegido, porque guarda os segredos do cluster.

## Registry e cadeia

- Imagem de registry confiável, assinada e verificada (ver
  `references/83-supply-chain-cicd.md`). Fixe por digest, não por tag móvel.

## Saída

Liste segredo na imagem, container privilegiado ou root, RBAC amplo, ausência de
NetworkPolicy, e imagem não varrida. Referências: Kubernetes Security Checklist, Pod
Security Standards, CNCF Supply Chain Best Practices.
