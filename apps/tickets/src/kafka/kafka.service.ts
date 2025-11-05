import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Partitioners } from 'kafkajs';
import {KAFKA_TOPICS, TicketReservedEvent} from "@kino-app/common/kafka/topics";


@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'tickets-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    await this.producer.connect();
  }

  async publishTicketReserved(event: TicketReservedEvent): Promise<void> {
    await this.producer.send({
      topic: KAFKA_TOPICS.TICKET_RESERVED,
      messages: [
        {
          key: `ticket-${event.ticketId}`,
          value: JSON.stringify(event),
        },
      ],
    });
  }

  async onModuleDestroy() {
    await this.producer?.disconnect();
  }
}
