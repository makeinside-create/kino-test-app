import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { ReserveTicketCommand } from './cqrs/commands/reserve-ticket.command';
import { CreateTicketCommand } from './cqrs/commands/create-ticket.command';
import { GetTicketsQuery } from './cqrs/queries/get-tickets.query';
import {Ticket} from "@kino-app/db/entities/ticket.entity";
import {UsersService} from "@kino-app/common/users/users.service";

@Resolver(() => Ticket)
export class TicketsResolver {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private usersService: UsersService,
  ) {}

  @Query(() => [Ticket])
  async tickets(@Args('eventId') eventId: string): Promise<Ticket[]> {
    const query = new GetTicketsQuery(eventId);
    return await this.queryBus.execute(query);
  }

  @Mutation(() => Ticket)
  async createTicket(
    @Args('eventId') eventId: string,
    @Args('seat') seat: number,
    @Args('token') token: string,
  ): Promise<Ticket> {
    const user = await this.usersService.validateUser(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const command = new CreateTicketCommand(eventId, seat);
    return await this.commandBus.execute(command);
  }

  @Mutation(() => Ticket)
  async reserveTicket(
    @Args('eventId') eventId: string,
    @Args('seat') seat: number,
    @Args('token') token: string,
  ): Promise<Ticket> {
    const user = await this.usersService.validateUser(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const command = new ReserveTicketCommand(eventId, seat, user.userId.toString(), token);
    return await this.commandBus.execute(command);
  }
}
