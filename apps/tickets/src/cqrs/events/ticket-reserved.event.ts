export class TicketReservedEvent {
  constructor(
    public readonly ticketId: string,
    public readonly userId: string,
    public readonly token: string,
  ) {}
}

