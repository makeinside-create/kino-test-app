import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
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
    const { eventId, seat, userId, token } = command;

    // Check if event exists
    const event = await this.ticketsService.getEventById(eventId);
    if (!event) {
      throw new BadRequestException('Event not found');
    }

    // Check if ticket exists and is available
    let ticket = await this.ticketsService.getTicketByEventAndSeat(
      eventId,
      seat,
    );

    if (!ticket) {
      // Create ticket if it doesn't exist
      const newTicket = await this.ticketsService.saveTicket({
        eventId,
        seat,
        status: TicketStatus.AVAILABLE,
      } as Ticket);
      ticket = newTicket;
    }

    if (ticket.status !== TicketStatus.AVAILABLE) {
      throw new BadRequestException('Ticket is already reserved');
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
