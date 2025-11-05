import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import {RedisStorageModule} from "@kino-app/redis-storage/redis-storage.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RedisStorageModule
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
