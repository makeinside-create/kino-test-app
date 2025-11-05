import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { CreateEventCommand } from '../commands/create-event.command';
import { EventsService } from '../../events.service';
import { Event } from '@kino-app/db/entities/event.entity';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler
  implements ICommandHandler<CreateEventCommand>
{
  constructor(private eventsService: EventsService) {}

  async execute(command: CreateEventCommand): Promise<Event> {
    const { name, date } = command;

    if (!name || !date) {
      throw new BadRequestException('Name and date are required');
    }

    return this.eventsService.createEvent({
      name,
      date,
    });
  }
}
