import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetEventsQuery } from './cqrs/queries/get-events.query';
import { CreateEventCommand } from './cqrs/commands/create-event.command';
import { UpdateEventCommand } from './cqrs/commands/update-event.command';
import { Event } from '@kino-app/db/entities/event.entity';

@Resolver(() => Event)
export class EventsResolver {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Query(() => [Event])
  async events(): Promise<Event[]> {
    const query = new GetEventsQuery();
    return await this.queryBus.execute(query);
  }

  @Mutation(() => Event)
  async createEvent(
    @Args('name') name: string,
    @Args('date') date: string,
  ): Promise<Event> {
    const command = new CreateEventCommand(name, new Date(date));
    return await this.commandBus.execute(command);
  }

  @Mutation(() => Event)
  async updateEvent(
    @Args('id') id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('date', { nullable: true }) date?: string,
  ): Promise<Event> {
    const command = new UpdateEventCommand(
      id,
      name,
      date ? new Date(date) : undefined,
    );
    return await this.commandBus.execute(command);
  }
}