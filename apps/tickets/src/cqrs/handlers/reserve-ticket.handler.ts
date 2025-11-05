import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReserveTicketCommand } from '../commands/reserve-ticket.command';
import { TicketsService } from '../../tickets.service';
import {Ticket, TicketStatus} from "@kino-app/db/entities/ticket.entity";
import {KafkaService} from "../../kafka/kafka.service";

@CommandHandler(ReserveTicketCommand)
export class ReserveTicketHandler
  implements ICommandHandler<ReserveTicketCommand>
{
  constructor(
    private ticketsService: TicketsService,
    private kafkaService: KafkaService,
  ) {}

  async execute(command: ReserveTicketCommand): Promise<Ticket> {
    const { ticketId, userId, token } = command;

    // Check if ticket exists
    const ticket = await this.ticketsService.getTicketById(ticketId);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check if ticket status is AVAILABLE
    if (ticket.status !== TicketStatus.AVAILABLE) {
      throw new BadRequestException('Ticket is not available');
    }

    // Reserve the ticket
    ticket.status = TicketStatus.RESERVED;
    ticket.userId = userId;
    const reservedTicket = await this.ticketsService.saveTicket(ticket);

    // Emit Kafka event
    if (reservedTicket.userId) {
      await this.kafkaService.publishTicketReserved({
        ticketId: reservedTicket.id,
        token
      });
    }

    return reservedTicket;
  }
}
