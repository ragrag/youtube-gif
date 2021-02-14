import * as Boom from '@hapi/boom';
import Container from 'typedi';
import { CreateJobDto } from '../common/dtos/createJob.dto';
import EventEmitter from '../common/utils/eventEmitter';
import { logger } from '../common/utils/logger';
import { Job } from '../entities/jobs.entity';
import RabbitMQService from './rabbitmq.service';

class JobsService {
  private events = {
    JobCreated: 'JobCreated',
  };

  constructor() {
    this.intiializeEvents();
  }

  private intiializeEvents() {
    EventEmitter.on(this.events.JobCreated, (job: Job) => {
      logger.info('Job Created');
      const rabbitMQInstance = Container.get(RabbitMQService);
      rabbitMQInstance.sendToQueue(JSON.stringify(job));
    });
  }

  public async findJobById(jobId: string): Promise<Job> {
    const job: Job = await Job.findOne(jobId);
    if (!job) throw Boom.notFound();

    return job;
  }

  public async createJob(jobDto: CreateJobDto): Promise<Job> {
    const createdJob: Job = await Job.save({ ...jobDto, youtubeId: jobDto.youtubeUrl.split('v=')[1]?.slice(0, 11), status: 'pending' } as Job);
    EventEmitter.emit(this.events.JobCreated, createdJob);
    return createdJob;
  }
}

export default JobsService;
