import { Service } from 'typedi';
import { ObjectID } from 'mongodb';
import { Job } from '../entities/jobs.entity';

@Service()
class JobsService {
  public async findJobById(jobId: string): Promise<Job> {
    const job: Job = await Job.findOne(jobId);

    return job;
  }

  public async updateJobById(jobId: string, updateDTO: Partial<Job>): Promise<void> {
    await Job.update(
      { id: new ObjectID(jobId) },
      {
        ...updateDTO,
      },
    );
  }
}

export default JobsService;
