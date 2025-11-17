import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config(); // loads .env automatically

// Select the database name based on your APP_MODE logic
const databaseName =
  process.env.APP_MODE === 'prod'
    ? process.env.DB_NAME
    : process.env.DB_DEV_NAME;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: databaseName,

  // ✔ Entities path based on your folder: src/core/db/entities/…
  entities: [
    join(__dirname, 'core', 'db', 'entities', '**', '*.entity.{ts,js}')
  ],

  // ✔ Migrations will be stored in: src/migrations/*
  migrations: [
    join(__dirname, 'migrations', '*.{ts,js}')
  ],

  // Logging options
  logging: /true/i.test(process.env.DB_LOGGING),

  // NEVER use synchronize in migrations mode
  synchronize: false,
});
