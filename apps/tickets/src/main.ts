import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TicketModule } from './ticket.module';

async function bootstrap() {
  const app = await NestFactory.create(TicketModule);
  /*const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);*/
  const port = process.env.TICKETS_PORT || 3003;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}

bootstrap();
