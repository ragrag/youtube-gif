import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import Container, { Service } from 'typedi';
import { Job } from '../entities/jobs.entity';
import ConversionService from './conversion.service';

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
      await this.startConsuming();
    } catch (err) {
      console.error(err);
    }
  }
  private async initializeConnection() {
    try {
      this.connection = await amqp.connect(process.env.NODE_ENV === 'production' ? process.env.RABBITMQ_PROD : process.env.RABBITMQ_DEV);
      console.info('Connected to RabbitMQ Server');
    } catch (err) {
      throw err;
    }
  }

  private async initializeChannel() {
    try {
      this.channel = await this.connection.createChannel();
      console.info('Created RabbitMQ Channel');
    } catch (err) {
      throw err;
    }
  }

  private async initializeQueues() {
    try {
      await this.channel.assertQueue(this.queueName, {
        durable: true,
      });
      console.info('Initialized RabbitMQ Queues');
    } catch (err) {
      throw err;
    }
  }

  public async startConsuming() {
    const conversionService = Container.get(ConversionService);
    this.channel.prefetch(1);
    console.info(' 🚀 Waiting for messages in %s. To exit press CTRL+C', this.queueName);
    this.channel.consume(
      this.queueName,
      async (msg: ConsumeMessage | null) => {
        if (msg) {
          const job: Job = JSON.parse(msg.content.toString());
          console.info(`Received new job 📩 `, job.id);
          try {
            await conversionService.beginConversion(job, {
              onSuccess: () => {
                this.channel.ack(msg);
              },
              onError: () => {
                this.channel.reject(msg, false);
              },
            });
          } catch (err) {
            console.error('Failed to process job', job.id, err);
          }
        }
      },
      {
        noAck: false,
      },
    );
  }
}
