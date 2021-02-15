import 'dotenv/config';
import request from 'supertest';
import App from '../../app';
import JobsRoute from '../../api/routes/jobs.route';
import { db } from '../util/db';
import { Job } from '../../entities/jobs.entity';
import { ObjectID } from 'mongodb';

let app;
beforeAll(async () => {
  const jobsRoute = new JobsRoute();
  app = new App([jobsRoute]);
  await app.initializeApp();
});

beforeEach(async () => {
  await db.clear();
});

describe('Job Routes', () => {
  describe('Create Jobs [Post] /api/v1/jobs', () => {
    it('success response statusCode 201', async done => {
      const res = await request(app.getServer()).post(`/api/v1/jobs`).send({
        youtubeUrl: 'https://www.youtube.com/watch?v=dQbKj24kIWc',
        startTime: 10,
        endTime: 20,
      });
      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      done();
    });

    it('invalid video duration, more than 8 minutes', async done => {
      const res = await request(app.getServer()).post(`/api/v1/jobs`).send({
        youtubeUrl: 'https://www.youtube.com/watch?v=RDfjXj5EGqI',
        startTime: 10,
        endTime: 20,
      });
      expect(res.status).toBe(400);
      done();
    });

    it('invalid youtube url  response statusCode 400', async done => {
      const res = await request(app.getServer()).post(`/api/v1/jobs`).send({
        youtubeUrl: 'https://www.youtube.com/watch?v=dQbKj24kIW',
        startTime: 10,
        endTime: 10,
      });
      expect(res.status).toBe(400);
      done();
    });

    it('invalid start/end times response statusCode 400', async done => {
      const res = await request(app.getServer()).post(`/api/v1/jobs`).send({
        youtubeUrl: 'https://www.youtube.com/watch?v=dQbKj24kIWc',
        startTime: 10,
        endTime: 10,
      });
      expect(res.status).toBe(400);
      done();
    });

    it('invalid gif duration', async done => {
      const res = await request(app.getServer()).post(`/api/v1/jobs`).send({
        youtubeUrl: 'https://www.youtube.com/watch?v=dQbKj24kIWc',
        startTime: 10,
        endTime: 50,
      });
      expect(res.status).toBe(400);
      done();
    });
  });

  describe('Get Jobs by id [GET] /api/v1/jobs/{id}', () => {
    it('success response statusCode 200 and job', async done => {
      const createdJob: Job = await Job.save({
        youtubeUrl: 'https://www.youtube.com/watch?v=dQbKj24kIWc',
        startTime: 10,
        endTime: 14,
        status: 'pending',
      } as Job);

      const res = await request(app.getServer()).get(`/api/v1/jobs/${createdJob.id}`);
      expect(res.status).toBe(202);
      expect(res.body.id).toBeDefined();
      done();
    });

    it('failed job does not exists statusCode 404', async done => {
      const res = await request(app.getServer()).get(`/api/v1/jobs/${new ObjectID()}`);
      expect(res.status).toBe(404);
      done();
    });
  });
});
