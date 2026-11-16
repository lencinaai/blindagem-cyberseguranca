# Cloud, serverless, IAM e infraestrutura como código

Vale para AWS, Azure, Google Cloud, Vercel e Cloudflare. O modelo é de
responsabilidade compartilhada: o provedor protege a nuvem, você protege o que põe
nela. Config errada de IAM ou de bucket é uma das maiores causas de vazamento.

## IAM e credenciais

- Menor privilégio em tudo. Cada serviço e componente tem identidade própria e só as
  permissões que precisa. Revise permissões acumuladas.
- Prefira identidade gerenciada, federação por OIDC e credencial temporária. Proíba
  chave de conta de serviço estática em código, imagem ou download. Se existir,
  rotacione.
- Conta administrativa separada do uso diário, com MFA resistente a phishing e acesso
  just-in-time. Conta de emergência (break-glass) mínima, protegida e monitorada.

## Armazenamento e exposição

- Bucket e storage privados por padrão. Bucket público é vazamento clássico. URL de
  objeto não é senha: se o dado é sensível, exige autenticação ou URL assinada com
  expiração.
- Nada de banco de dados exposto direto à internet. O frontend nunca fala direto com
  o banco. Rede fechada por padrão, com egress controlado.

## Serverless e Vercel

- Variáveis de ambiente da Vercel são visíveis a quem tem acesso ao projeto e só
  afetam novos deploys. Segredo de verdade usa variável sensível, e nunca vai para o
  cliente.
- Server Actions e rotas de API são endpoints públicos: validam autenticação e
  autorização dentro, não confiam em quem chama.
- Proteção de deploy de preview conforme o plano, para o ambiente de teste não vazar.
- Cache e ISR não podem servir dado de um usuário para outro.

## Infraestrutura como código e estado real

- IaC (Terraform e afins) versionado e revisado. Cuidado com segredo no state.
- Ler o código não prova o estado efetivo. Confirme o que está mesmo aplicado no
  painel: IAM, WAF, DNS, regras de rede. Isso vira item "precisa verificação".
- Alerta de custo e billing, porque config aberta ou abuso aparece primeiro na conta
  (ver `references/40-backups-resiliencia.md`).

## Saída

Liste identidades e permissões amplas, buckets e serviços expostos, tratamento de
segredo e estado de rede. Referências: AWS Well-Architected Security Pillar, Google
Cloud e Azure security, NIST SP 800-207A, documentação da Vercel.
