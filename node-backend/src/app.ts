import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { createConnection } from 'typeorm';
import dbConnection from './db/connection';
import Routes from './common/interfaces/routes.interface';
import errorMiddleware from './api/middlewares/error.middleware';
import { logger, stream } from './common/utils/logger';
import Container from 'typedi';
import RabbitMqService from './services/rabbitmq.service';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;
  public routes: Routes[];
  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.env = process.env.NODE_ENV || 'development';
    this.routes = routes;
  }

  public async initializeApp() {
    await this.connectToDatabase();
    this.initializeRabbitMQ();
    this.initializeMiddlewares();
    this.initializeRoutes(this.routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    try {
      const connection = await createConnection(dbConnection);
      await connection.driver.afterConnect();
      logger.info('🟢 The database is connected.');
    } catch (err) {
      logger.error(`🔴 Unable to connect to the database: ${err}.`);
    }
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(morgan('combined', { stream }));
      this.app.use(cors({ origin: true }));
      this.app.set('trust proxy', 1);
    } else if (this.env === 'development') {
      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser(process.env.JWT_SECRET));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api/v1/', route.router);
    });
  }

  private initializeRabbitMQ() {
    Container.get(RabbitMqService);
  }
  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['./src/api/spec/swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    logger.info('🚀 API Docs running at /api/docs');
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
