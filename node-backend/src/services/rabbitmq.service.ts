import { Service } from 'typedi';
import amqp, { Channel, Connection } from 'amqplib';
import { logger } from '../common/utils/logger';

@Service()
export default class RabbitMQService {
  private connection: Connection;
  private channel: Channel;
  private queueName = 'ytgif-jobs';
  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    try {
      await this.initializeConnection();
      await this.initializeChannel();
      await this.initializeQueues();
    } catch (err) {
      logger.error(err);
    }
  }
  private async initializeConnection() {
    try {
      this.connection = await amqp.connect(process.env.NODE_ENV === 'production' ? process.env.RABBITMQ_PROD : process.env.RABBITMQ_DEV);
      logger.info('Connected to RabbitMQ Server');
    } catch (err) {
      throw err;
    }
  }

  private async initializeChannel() {
    try {
      this.channel = await this.connection.createChannel();
      logger.info('Created RabbitMQ Channel');
    } catch (err) {
      throw err;
    }
  }

  private async initializeQueues() {
    try {
      await this.channel.assertQueue(this.queueName, {
        durable: true,
      });
      logger.info('Initialized RabbitMQ Queues');
    } catch (err) {
      throw err;
    }
  }

  public async sendToQueue(message: string) {
    if (process.env.NODE_ENV === 'testing') return;
    this.channel.sendToQueue(this.queueName, Buffer.from(message), {
      persistent: true,
    });
    logger.info(`sent: ${message} to queue ${this.queueName}`);
  }
}
