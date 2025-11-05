import { DataSource } from 'typeorm';
import { User } from '../../libs/db/src/entities/user.entity';
import { Event } from '../../libs/db/src/entities/event.entity';
import { Ticket } from '../../libs/db/src/entities/ticket.entity';
import * as dotenv from 'dotenv';

dotenv.config();

// Ensure User entity is loaded before Ticket to help TypeORM resolve relations
// This is necessary because Ticket has a @ManyToOne relation to User
const _ensureUserLoaded = User;

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'kinodb',
  entities: [User, Event, Ticket],
  migrations: ['apps/tickets/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;

// npm run typeorm:tickets migration:generate apps/tickets/migrations/CreateOtherTables
