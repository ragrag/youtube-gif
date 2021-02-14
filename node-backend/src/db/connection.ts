import { ConnectionOptions } from 'typeorm';

const env = process.env.NODE_ENV || 'development';

const dbConnectionUrls = {
  production: process.env.DATABASE_URL_PROD,
  development: process.env.DATABASE_URL_DEV,
  testing: process.env.DATABASE_URL_TEST,
};

const dbConnection: ConnectionOptions = {
  url: dbConnectionUrls[env],
  type: 'mongodb',
  logging: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  entities: [env === 'production' ? 'build/entities/*{.ts,.js}' : 'src/entities/*{.ts,.js}'],
  // migrationsRun: true,
  cli: {
    entitiesDir: 'src/entities',
  },
};

export = dbConnection;
