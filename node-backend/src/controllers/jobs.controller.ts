import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { CreateJobDto } from '../common/dtos/createJob.dto';
import { Job } from '../entities/jobs.entity';
import JobsService from '../services/jobs.service';

class JobsController {
  constructor(private jobService = new JobsService()) {}

  public createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobDto: CreateJobDto = plainToClass(CreateJobDto, req.body, { excludeExtraneousValues: true });
      const createdJob: Job = await this.jobService.createJob(jobDto);

      res.status(201).json(createdJob);
    } catch (error) {
      next(error);
    }
  };

  public getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobId = req.params.id;
      const job: Job = await this.jobService.findJobById(jobId);

      const responseStatus = job.status === 'done' ? 200 : 202;
      res.status(responseStatus).json(job);
    } catch (error) {
      next(error);
    }
  };
}

export default JobsController;
