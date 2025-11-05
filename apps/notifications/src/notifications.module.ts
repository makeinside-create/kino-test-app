import {Module} from '@nestjs/common';
import {NotificationsService} from './notifications.service';
import {GrpcModule} from '@kino-app/grpc/grpc.module';
import {RedisStorageModule} from '@kino-app/redis-storage/redis-storage.module';
import {KafkaConsumerService} from "./kafka-consumer.service";

@Module({
  imports: [
    RedisStorageModule,
    GrpcModule,
  ],
  providers: [NotificationsService, KafkaConsumerService],
})
export class NotificationsModule {
}
