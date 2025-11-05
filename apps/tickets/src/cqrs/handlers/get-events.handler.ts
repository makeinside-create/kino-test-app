import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetEventsQuery } from '../queries/get-events.query';
import { EventsService } from '../../events.service';
import { Event } from '@kino-app/db/entities/event.entity';

@QueryHandler(GetEventsQuery)
export class GetEventsHandler implements IQueryHandler<GetEventsQuery> {
  constructor(private eventsService: EventsService) {}

  async execute(query: GetEventsQuery): Promise<Event[]> {
    return this.eventsService.getAllEvents();
  }
}

