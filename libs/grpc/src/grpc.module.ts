import { Module } from '@nestjs/common';
import { GrpcService } from './grpc.service';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  providers: [GrpcService],
  exports: [GrpcService],
})
export class GrpcModule {}
