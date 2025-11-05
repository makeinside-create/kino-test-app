import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { UpdateEventCommand } from '../commands/update-event.command';
import { EventsService } from '../../events.service';
import { Event } from '@kino-app/db/entities/event.entity';

@CommandHandler(UpdateEventCommand)
export class UpdateEventHandler
  implements ICommandHandler<UpdateEventCommand>
{
  constructor(private eventsService: EventsService) {}

  async execute(command: UpdateEventCommand): Promise<Event> {
    const { id, name, date } = command;

    // Check if event exists
    const event = await this.eventsService.getEventById(id);
    if (!event) {
      throw new BadRequestException('Event not found');
    }

    const updateData: Partial<Event> = {};
    if (name !== undefined) {
      updateData.name = name;
    }
    if (date !== undefined) {
      updateData.date = date;
    }

    return this.eventsService.updateEvent(id, updateData);
  }
}
