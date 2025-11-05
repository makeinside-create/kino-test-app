import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '@kino-app/db/entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async getEventById(id: string): Promise<Event | null> {
    return this.eventRepository.findOne({ where: { id } });
  }

  async createEvent(event: Partial<Event>): Promise<Event> {
    const newEvent = this.eventRepository.create(event);
    return this.eventRepository.save(newEvent);
  }

  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    await this.eventRepository.update(id, event);
    const updatedEvent = await this.eventRepository.findOne({ where: { id } });
    if (!updatedEvent) {
      throw new Error('Event not found after update');
    }
    return updatedEvent;
  }
}

