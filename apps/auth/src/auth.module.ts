import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGrpcController } from './auth-grpc.controller';
import {RedisStorageModule} from "@kino-app/redis-storage/redis-storage.module";
import {User} from "@kino-app/db/entities/user.entity";
import {UsersModule} from "@kino-app/common/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'kinodb',
      entities: [User],
      synchronize: false,
      // migrations: ['dist/apps/auth/migrations/*.js'],
      // migrationsRun: true,
    }),
    TypeOrmModule.forFeature([User]),
    RedisStorageModule,
    UsersModule
  ],
  controllers: [AuthController, AuthGrpcController],
  providers: [AuthService]
})
export class AuthModule {}
