# Rede, DNS, e-mail e TLS

O domínio e o e-mail são superfície de ataque que muita gente esquece. Sequestro de
DNS, e-mail falsificado em nome da sua marca, e TLS mal configurado abrem porta.

## DNS e domínio

- Conta do registrador e do provedor de DNS com MFA. Sequestro de DNS redireciona
  todo o tráfego.
- Registro CAA para restringir quais autoridades certificadoras podem emitir
  certificado para o seu domínio, reduzindo emissão indevida.
- Cuidado com subdomínio órfão apontando para serviço desativado (takeover de
  subdomínio): um atacante recria o serviço e assume o subdomínio.

## E-mail (contra falsificação da sua marca)

Três registros trabalham juntos para impedir que alguém mande e-mail se passando por
você:

- SPF (RFC 7208): autoriza quais servidores podem enviar em nome do domínio.
- DKIM (RFC 6376): assina a mensagem, provando origem e integridade.
- DMARC (RFC atual da série 9989): define a política quando SPF ou DKIM falham
  (rejeitar, quarentena) e recebe relatórios. Sem DMARC em `reject`, sua marca pode
  ser usada em phishing.
- Para transporte, MTA-STS e TLS-RPT ajudam a garantir entrega cifrada.

## TLS

- HTTPS em tudo, com TLS atual (1.3, ou 1.2 bem configurado). Na Vercel e Cloudflare
  é automático. Desabilite protocolos e cifras obsoletos.
- HSTS aplicado depois de confirmar que tudo funciona em HTTPS, com decisão
  consciente sobre `includeSubDomains` e `preload`.
- Sem conteúdo por HTTP dentro de página HTTPS (mixed content). Valide em SSL Labs.

## Segmentação de rede

- Serviço só expõe a porta que precisa. Banco e serviços internos não ficam abertos à
  internet. Acesso administrativo por rede privada ou bastion, não direto.

## security.txt

- Publique um `/.well-known/security.txt` (RFC 9116) com canal para receber reporte
  de vulnerabilidade de forma responsável.

## Saída

Liste MFA no registrador, presença de CAA, SPF/DKIM/DMARC, estado do TLS e HSTS, e
subdomínios órfãos. A maioria é ação de painel do usuário no registrador, no DNS e no
provedor de e-mail.
