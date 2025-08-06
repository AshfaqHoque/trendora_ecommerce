// src/config/database.config.ts

// src/config/database.config.ts

// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';

// export const databaseConfig = (): TypeOrmModuleOptions => ({
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: '01082000', // PostgreSQL password
//   database: 'e-commerce', // Database name
//   entities: [],  // Add your entities here
//   migrations: [],
//   logging: false,
//   autoLoadEntities: true,
//   synchronize: true, // Be careful with this in production, as it automatically syncs your schema
// });

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource,DataSourceOptions } from 'typeorm';
import {config} from 'dotenv';

config();

export const databaseConfig = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD, // PostgreSQL password
  database: process.env.DB_DATABASE, // Database name
  entities: ['dist/**/*.entity{.ts,.js}'],  // Add your entities here
  migrations: [],
  logging: false,
  //autoLoadEntities: true,
  synchronize: true, // Be careful with this in production, as it automatically syncs your schema
});



const dataSource = new DataSource(databaseConfig()); // Pass the result of databaseConfig()

export default dataSource;

// If you want to use the dataSource instance directly
dataSource.initialize()
  .then(() => {
    console.log("DataSource initialized successfully");
  })
  .catch((error) => {
    console.log("Error initializing DataSource:", error);
  });
