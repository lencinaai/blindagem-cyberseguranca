# WordPress e CMS

WordPress roda boa parte da web e é alvo constante, quase sempre por plugin
desatualizado ou senha fraca, não por falha do núcleo. A análise não se reduz a
instalar um plugin de backup e um antivírus.

## Atualização e superfície

- Núcleo, tema e plugins sempre atualizados. Plugin desatualizado é o vetor número
  um. Remova plugin e tema que não usa; cada um é superfície de ataque.
- Nunca use plugin ou tema pirata (nulled): costuma vir com backdoor.
- Minimize plugins. Prefira os mantidos e populares, de fonte oficial.

## Acesso e configuração

- Senha forte e MFA em todas as contas, principalmente administrador. Limite
  tentativas de login (contra força bruta) e considere trocar a URL de login padrão.
- Menor privilégio nos papéis: nem todo mundo é administrador.
- `wp-config.php` protegido, com chaves de segurança (salts) próprias. Desative a
  edição de arquivos pelo painel (`DISALLOW_FILE_EDIT`).
- Desative XML-RPC se não usar, pois é usado em ataques de força bruta e amplificação.

## Servidor e arquivos

- Permissões de arquivo corretas. A pasta de uploads não executa PHP.
- CRÍTICO: `.git`, backup e `wp-config` não podem ser acessíveis pela URL. Teste
  pedir `/.git/` e confirmar que dá 404, não 200.
- WAF na frente (Cloudflare ou plugin de segurança) contra bots e exploração
  conhecida.

## Backup e limpeza de incidente

- Backup de banco e arquivos, externo, automático e com teste de restauração (ver
  `references/40-backups-resiliencia.md`). Nunca deixe o único backup na mesma
  hospedagem, porque o atacante apaga junto.
- Se foi comprometido, limpar não basta: identifique o ponto de entrada, troque
  todas as senhas e salts, e restaure de backup limpo anterior à invasão.

## Saída

Liste versões desatualizadas, plugins suspeitos, força de senha e MFA, exposição de
arquivos sensíveis, e situação de backup. Referências: documentação oficial de
hardening do WordPress.
