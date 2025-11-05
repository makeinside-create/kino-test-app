import { Injectable } from '@nestjs/common';
import { RedisStorageService } from '@kino-app/redis-storage/redis-storage.service';
import { GrpcService } from '@kino-app/grpc/grpc.service';
import { TicketReservedEvent } from '@kino-app/common/kafka/topics';

@Injectable()
export class NotificationsService {
  constructor(
    private redisService: RedisStorageService,
    private grpcService: GrpcService,
  ) {}

  async handleTicketReserved(event: TicketReservedEvent): Promise<void> {

    try {
      let email = await this.redisService.get(`email:${event.token}`);

      if (!email) {
        email = await this.grpcService.getUserEmail(event.token);

        if (email) {
          await this.redisService.set(`email:${event.token}`, email, 86400);
        }
      }

      if (email) {
        console.log(
            `Email sent to user ${email} for ticket ${event.ticketId}.`,
        );
      } else {
        console.log(
          `User validation failed for token. ` +
            `Could not retrieve email for ticket ${event.ticketId}.`,
        );
        return;
      }
    } catch (error) {
      console.error(
        `Error calling gRPC validateUser for ticket ${event.ticketId}:`,
        error,
      );
      return;
    }
  }
}
