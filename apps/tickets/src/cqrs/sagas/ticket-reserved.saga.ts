import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TicketReservedEvent } from '../events/ticket-reserved.event';
import { PublishTicketReservedCommand } from '../commands/publish-ticket-reserved.command';

@Injectable()
export class TicketReservedSaga {
  @Saga()
  ticketReserved = (
    events$: Observable<TicketReservedEvent>,
  ): Observable<PublishTicketReservedCommand> => {
    return events$.pipe(
      ofType(TicketReservedEvent),
      map(
        ({ ticketId, token }) =>
          new PublishTicketReservedCommand(ticketId, token),
      ),
    );
  };
}

