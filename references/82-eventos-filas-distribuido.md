# Eventos, filas e sistemas distribuídos

Arquitetura orientada a eventos (broker, fila, mensageria) desacopla serviços, mas
cria riscos próprios: mensagem duplicada, fora de ordem, envenenada, ou dado sensível
trafegando sem controle. Carregue esta referência se houver Kafka, Pub/Sub, SQS,
EventBridge, RabbitMQ ou cron/worker.

## Identidade e acesso ao broker

- Cada serviço produtor e consumidor tem identidade própria e permissão mínima (ACL):
  só publica no tópico que deve, só consome do que deve. TLS entre serviço e broker.
- O broker não fica exposto à internet sem autenticação.

## Entrega e idempotência

- A maioria dos brokers entrega "pelo menos uma vez", então a mesma mensagem pode
  chegar duas vezes. O consumidor precisa ser idempotente: processar o mesmo evento
  duas vezes não pode liberar produto, cobrar ou contar em dobro. Use um id de evento
  e registre o que já foi processado (o mesmo princípio do webhook da Cakto).
- Trate evento fora de ordem: não assuma que chegou na sequência.

## Robustez

- Dead letter queue (DLQ) para a mensagem que falha repetidamente, para não travar a
  fila nem se perder. Reprocessamento controlado, não infinito.
- Padrão outbox para não perder evento entre gravar no banco e publicar.
- Valide o schema da mensagem na entrada do consumidor; mensagem malformada é entrada
  não confiável.

## Privacidade

- Cuidado com dado pessoal dentro do evento: ele se espalha por vários serviços e
  logs. Minimize, e considere referência em vez de dado completo.

## Saída

Liste ACL do broker, idempotência dos consumidores, DLQ, validação de schema e dado
sensível em evento. Referências: documentação de segurança do Kafka, Pub/Sub best
practices, Azure resilient events.
