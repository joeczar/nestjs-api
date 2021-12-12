import { ConnectionOptions } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export default {
  name: process.env.CONNECTION_NAME,
  type: 'postgres',
  host: process.env.HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
  migrations: ['src/migration/**/*.ts', 'dist/migration/**/*.js'],
  subscribers: ['src/subscriber/**/*.ts', 'dist/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
