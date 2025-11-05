import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CqrsModule} from "@nestjs/cqrs";
import {Ticket} from "@kino-app/db/entities/ticket.entity";
import {Event} from "@kino-app/db/entities/event.entity";
import {KafkaModule} from "./kafka/kafka.module";
import {TicketsResolver} from "./tickets.resolver";
import {TicketsService} from "./tickets.service";
import {GetTicketsHandler} from "./cqrs/handlers/get-tickets.handler";
import {ReserveTicketHandler} from "./cqrs/handlers/reserve-ticket.handler";
import {CreateTicketHandler} from "./cqrs/handlers/create-ticket.handler";
import {EventsResolver} from "./events.resolver";
import {EventsService} from "./events.service";
import {GetEventsHandler} from "./cqrs/handlers/get-events.handler";
import {CreateEventHandler} from "./cqrs/handlers/create-event.handler";
import {UpdateEventHandler} from "./cqrs/handlers/update-event.handler";
import {UsersModule} from "@kino-app/common/users/users.module";
import {User} from "@kino-app/db/entities/user.entity";

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
      entities: [Event, Ticket, User],
      synchronize: false,
      // migrations: ['dist/apps/auth/migrations/*.js'],
      // migrationsRun: true,
    }),
    TypeOrmModule.forFeature([Event, Ticket]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: true,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      playground: true,
    }),
    CqrsModule,
    KafkaModule,
    UsersModule,
  ],
  providers: [
    TicketsResolver,
    TicketsService,
    GetTicketsHandler,
    ReserveTicketHandler,
    CreateTicketHandler,
    EventsResolver,
    EventsService,
    GetEventsHandler,
    CreateEventHandler,
    UpdateEventHandler,
  ],
})
export class TicketModule {
}
