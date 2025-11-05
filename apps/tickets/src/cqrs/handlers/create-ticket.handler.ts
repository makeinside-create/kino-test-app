import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { CreateTicketCommand } from '../commands/create-ticket.command';
import { TicketsService } from '../../tickets.service';
import { Ticket, TicketStatus } from '@kino-app/db/entities/ticket.entity';

@CommandHandler(CreateTicketCommand)
export class CreateTicketHandler
  implements ICommandHandler<CreateTicketCommand>
{
  constructor(private ticketsService: TicketsService) {}

  async execute(command: CreateTicketCommand): Promise<Ticket> {
    const { eventId, seat } = command;

    // Check if event exists
    const event = await this.ticketsService.getEventById(eventId);
    if (!event) {
      throw new BadRequestException('Event not found');
    }

    // Check if ticket already exists
    const existingTicket = await this.ticketsService.getTicketByEventAndSeat(
      eventId,
      seat,
    );

    if (existingTicket) {
      throw new BadRequestException('Ticket already exists for this event and seat');
    }

    // Create ticket with default values
    const newTicket = await this.ticketsService.saveTicket({
      eventId,
      seat,
      status: TicketStatus.AVAILABLE,
    } as Ticket);

    return newTicket;
  }
}

