import { DataSource } from 'typeorm';
import { User } from '../../libs/db/src/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();


const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'kinodb',
  entities: [User],
  migrations: ['apps/auth/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;
