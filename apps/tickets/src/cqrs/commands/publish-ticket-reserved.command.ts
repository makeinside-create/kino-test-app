export class PublishTicketReservedCommand {
  constructor(
    public readonly ticketId: string,
    public readonly token: string,
  ) {}
}

