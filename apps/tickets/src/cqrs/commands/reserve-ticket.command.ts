export class ReserveTicketCommand {
  constructor(
    public readonly eventId: string,
    public readonly seat: number,
    public readonly userId: string,
    public readonly token: string,
  ) {}
}
