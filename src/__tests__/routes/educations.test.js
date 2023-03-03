import request from 'supertest';
import app from '../../app';
import { educationData } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';
import { User, Token, PersonEducation } from '../../models';
import * as statusCodes from '../../constants/statusCodes';

let tokenData;
let token;
let educationId;
let education;
let user;
describe('educations', () => {
  beforeAll(async () => {
    user = await User.findOne({ username: 'admin' });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
    education = await PersonEducation.create(educationData);
  });

  describe('create a education', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/educations`)
        .send(educationData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return a `new education`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/educations`)
        .set('Authorization', token)
        .send(educationData);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.education).toHaveProperty('institution');
    });
  });

  describe('update a education', () => {
    beforeAll(async () => {
      const res = await request(app)
        .post(`${urlPrefix}/educations`)
        .set('Authorization', token)
        .send(educationData);
      educationId = res.body.education._id;
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/educations/${educationId}`)
        .send(educationData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/educations/${education._id}`)
        .set('Authorization', token)
        .send(educationData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Server Error`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/educations/fake-education-id`)
        .send(educationData);
      expect(res.status).toBe(statusCodes.SERVER_ERROR);
    });

    test('should return a `updated education`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/educations/${educationId}`)
        .set('Authorization', token)
        .send(educationData);
      expect(res.status).toBe(statusCodes.OK);
    });
  });

  describe('retreive all educations', () => {
    test('should return `Education array`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/educations`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.educations).toBeDefined();
    });
  });

  describe('delete a education', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app).delete(`${urlPrefix}/educations/${educationId}`,);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/educations/${education._id}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `deleted education`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/educations/${educationId}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
    });
  });
});
