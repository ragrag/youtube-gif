import { Router } from 'express';
import { CreateJobDto } from '../../common/dtos/createJob.dto';
import Route from '../../common/interfaces/routes.interface';
import JobsController from '../../controllers/jobs.controller';
import validationMiddleware from '../middlewares/validation.middleware';

class JobsRoute implements Route {
  public path = '/jobs';
  public router = Router();

  constructor(private jobsController = new JobsController()) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.jobsController.getJobById);
    this.router.post(`${this.path}`, validationMiddleware(CreateJobDto, 'body'), this.jobsController.createJob);
  }
}

export default JobsRoute;
