import request from 'supertest';
import app from '../../app';
import { jobData, jobCategoryData } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';
import { User, Token, JobCategory } from '../../models';
import * as statusCodes from '../../constants/statusCodes';

let tokenData;
let token;
let jobCategory;
let user;
describe('jobCategories', () => {
  beforeAll(async () => {
    await JobCategory.deleteMany({});
    user = await User.findOne({ username: 'admin' });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
    await JobCategory.updateOne(
      { name: jobCategoryData.name },
      jobCategoryData,
      {
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
    jobCategory = await JobCategory.findOne({ name: jobCategoryData.name });
    jobData.category = jobCategory._id;
  });

  describe('create a job category', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/jobs/categories`)
        .send(jobCategoryData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return a `new job category`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/jobs/categories`)
        .set('Authorization', token)
        .send({
          name: 'Software Engineer',
        });
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.jobCategory).toHaveProperty('name');
    });
  });

  describe('update a job category', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/jobs/categories/${jobCategory.slug}`)
        .send({ name: 'Software Developer' });
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Job Category does not exist`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/jobs/categories/fake-post-slug`)
        .set('Authorization', token)
        .send({ name: 'Software Developer' });
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe('Job Category does not exist');
    });

    test('should return a `updated job category`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/jobs/categories/${jobCategory.slug}`)
        .set('Authorization', token)
        .send({ description: 'Description' });
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.jobCategory).toHaveProperty('name');
    });
  });

  describe('retreive a job category', () => {
    test('should return `Job Category does not exist`', async () => {
      const res = await request(app).get(`${urlPrefix}/jobs/categories/fake-post-slug`);
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe('Job Category does not exist');
    });

    test('should return `a job category`', async () => {
      const res = await request(app).get(`${urlPrefix}/jobs/categories/${jobCategory.slug}`);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.jobCategory).toHaveProperty('name');
    });
  });

  describe('retreive all job categorys', () => {
    test('should return `Job Categories array`', async () => {
      const res = await request(app).get(`${urlPrefix}/jobs/categories`);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.jobCategories).toBeDefined();
    });
  });

  describe('delete a job category', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app).delete(`${urlPrefix}/jobs/categories/${jobCategory.slug}`);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });
    test('should return `deleted job category`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/jobs/categories/${jobCategory.slug}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.jobCategory).toHaveProperty('name');
    });
  });
});