import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);


  // gRPC microservice
  const protoPath = join(
    __dirname,
    '../../../libs/common/src/proto/auth.proto',
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: protoPath,
      url: process.env.GRPC_URL || '0.0.0.0:5001',
    },
  });

  await app.startAllMicroservices();


  /*const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);*/
  const port = process.env.AUTH_PORT || 3001;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}

bootstrap();
