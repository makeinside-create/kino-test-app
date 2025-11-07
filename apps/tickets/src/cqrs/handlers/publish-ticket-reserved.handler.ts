import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishTicketReservedCommand } from '../commands/publish-ticket-reserved.command';
import { KafkaService } from '../../kafka/kafka.service';

@CommandHandler(PublishTicketReservedCommand)
export class PublishTicketReservedHandler
  implements ICommandHandler<PublishTicketReservedCommand>
{
  constructor(private readonly kafkaService: KafkaService) {}

  async execute(command: PublishTicketReservedCommand): Promise<void> {
    const { ticketId, token } = command;

    await this.kafkaService.publishTicketReserved({
      ticketId,
      token,
    });
  }
}

