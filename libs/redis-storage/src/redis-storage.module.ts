import { Module } from '@nestjs/common';
import { RedisStorageService } from './redis-storage.service';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  providers: [RedisStorageService],
  exports: [RedisStorageService],
})
export class RedisStorageModule {}
