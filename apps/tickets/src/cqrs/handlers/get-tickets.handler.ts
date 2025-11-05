import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetTicketsQuery } from '../queries/get-tickets.query';
import { TicketsService } from '../../tickets.service';
import {Ticket} from "@kino-app/db/entities/ticket.entity";


@QueryHandler(GetTicketsQuery)
export class GetTicketsHandler implements IQueryHandler<GetTicketsQuery> {
  constructor(private ticketsService: TicketsService) {}

  async execute(query: GetTicketsQuery): Promise<Ticket[]> {
    return this.ticketsService.getTicketsByEventId(query.eventId);
  }
}
