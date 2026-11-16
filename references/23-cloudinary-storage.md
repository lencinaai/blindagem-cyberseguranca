# Cloudinary, upload e storage de mídia

Upload é uma das funções mais perigosas de implementar, e a IA gera o caminho feliz:
recebe o arquivo, salva e devolve a URL, sem validar de verdade. O atacante manda o
que não deveria.

## Riscos de upload

- Executável disfarçado: um `.php` ou script renomeado como imagem. Content-type
  spoof: o arquivo diz ser imagem no header, mas é outra coisa.
- Path traversal no nome do arquivo (`../../etc/passwd`) para escrever fora da pasta.
- SVG com JavaScript embutido, PDF com macro, imagem com payload em metadados (EXIF)
  ou escondido em pixels (steganography), e arquivos polyglot que são imagem válida
  e script ao mesmo tempo.
- Zip bomb: arquivo pequeno que descomprime em gigabytes e derruba o servidor.

## Validação correta

- Valide tamanho, extensão e tipo, e principalmente os magic bytes, lendo os
  primeiros bytes do arquivo. Nunca confie no `content-type` que veio na requisição,
  que é forjável.
- Reprocesse a imagem com uma biblioteca de imagem (redesenha pixel a pixel), o que
  destrói payload em EXIF, steganography e polyglot.
- Renomeie o arquivo com um identificador seu, não use o nome original, para evitar
  path traversal e para não facilitar a vida de quem tenta achar o arquivo depois.
- SVG é XML com JavaScript possível: sanitize como XML (com um sanitizador
  mantido), converta para PNG, ou não aceite SVG de usuário desconhecido.
- Limite tamanho e taxa de upload por usuário, contra abuso e zip bomb.

## Cloudinary especificamente

- CRÍTICO: o API secret do Cloudinary nunca vai para o cliente. Ele fica só no
  servidor (ver `references/14-segredos-cripto.md`). O que vaza é a conta inteira.
- Upload assinado: prefira upload com assinatura gerada no servidor, em vez de upload
  não assinado (unsigned preset) aberto, que qualquer um pode abusar para encher sua
  conta e gerar custo. Se usar unsigned, restrinja por preset, pasta, formato e
  tamanho.
- Upload preset e transformações restritas: limite formatos e transformações
  permitidas, para não virar um serviço de processamento gratuito para terceiros.
- URL de entrega: se a mídia é privada, use URL assinada com expiração, não URL
  pública adivinhável. Lembre que URL não é senha; ela fica em histórico e cache.
- Alerta de billing e teto de uso (ver `references/40-backups-resiliencia.md`), já
  que a Cloudinary é faturada por uso.

## Saída

Registre onde o API secret está guardado, se o upload é assinado ou aberto, se há
validação por magic bytes e reprocessamento, o tratamento de SVG, e os limites de
tamanho e taxa. As configurações de preset e billing entram como pendências do
usuário no painel da Cloudinary.
