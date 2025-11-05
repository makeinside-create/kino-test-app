export class CreateTicketCommand {
  constructor(
    public readonly eventId: string,
    public readonly seat: number,
  ) {}
}

