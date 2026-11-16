# Mobile (Android, iOS, React Native, Expo)

Um app mobile é distribuído para o dispositivo do usuário, e o dispositivo pode ser
hostil. Tudo que está no pacote pode ser extraído por engenharia reversa. O backend
continua responsável pela autorização.

## Segredos e chaves

- CRÍTICO: API key, senha ou chave no bundle do app (código JavaScript no React
  Native, ou recurso no APK/IPA). O pacote é descompilável (apktool, JADX no Android;
  ferramentas equivalentes no iOS). Variável de ambiente no app não é segura.
- Chamada a serviço sensível passa por um backend próprio (padrão BFF, backend for
  frontend), que guarda a chave. O app fala com o seu servidor, não direto com o
  provedor.

## Armazenamento no dispositivo

- Token e segredo vão no Keychain (iOS) ou Keystore (Android), protegidos por
  hardware. No React Native, use Expo SecureStore ou equivalente.
- Não guarde token de sessão em armazenamento comum (AsyncStorage, equivalente ao
  localStorage), que é acessível.

## Superfície do app

- Deep links validados: não deixe um link abrir tela sensível ou executar ação sem
  verificar origem e parâmetros.
- WebView com cuidado: não habilite JavaScript e acesso a arquivo sem necessidade,
  não carregue conteúdo não confiável.
- Componentes exportados (Android) e permissões mínimas.
- Considere atestação de integridade do app (App Attest, Play Integrity) para reduzir
  cliente adulterado, lembrando que é sinal, não garantia.

## Rede

- HTTPS com validação de certificado. Bloqueie conexão insegura (Android Network
  Security Config, iOS App Transport Security). Certificate pinning quando o risco
  justificar.

## Saída

Liste segredo no bundle, armazenamento de token, deep links e WebView, permissões, e
validação de rede. O backend precisa autorizar tudo, porque o app não é confiável.
Referências: OWASP MASVS, guias de segurança do Android e da Apple.
