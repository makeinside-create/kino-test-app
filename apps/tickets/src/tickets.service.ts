import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Event} from '@kino-app/db/entities/event.entity';
import {Ticket} from "@kino-app/db/entities/ticket.entity";

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {
  }

  async getEventById(id: string): Promise<Event | null> {
    return this.eventRepository.findOne({where: {id}});
  }

  async getTicketsByEventId(eventId: string): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: {eventId},
      relations: ['event'],
    });
  }

  async getTicketByEventAndSeat(
    eventId: string,
    seat: number,
  ): Promise<Ticket | null> {
    return this.ticketRepository.findOne({
      where: {eventId, seat},
    });
  }

  async getTicketById(id: string): Promise<Ticket | null> {
    return this.ticketRepository.findOne({
      where: {id},
    });
  }

  async saveTicket(ticket: Ticket): Promise<Ticket> {
    return this.ticketRepository.save(ticket);
  }
}
