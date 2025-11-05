import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { KAFKA_TOPICS, TicketReservedEvent } from '@kino-app/common/kafka/topics';
import { NotificationsService } from './notifications.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;

  constructor(private notificationsService: NotificationsService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'notifications-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.consumer = kafka.consumer({ groupId: 'notifications-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: KAFKA_TOPICS.TICKET_RESERVED,
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (topic === KAFKA_TOPICS.TICKET_RESERVED) {
          const event: TicketReservedEvent = JSON.parse(
            message.value?.toString() || '{}',
          ) as TicketReservedEvent;
          await this.notificationsService.handleTicketReserved(event);
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer?.disconnect();
  }
}
