export const KAFKA_TOPICS = {
  TICKET_RESERVED: 'ticket.reserved',
} as const;

export interface TicketReservedEvent {
  ticketId: string;
  token: string;
}
