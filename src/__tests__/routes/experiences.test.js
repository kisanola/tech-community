import request from 'supertest';
import app from '../../app';
import { experienceData } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';
import { User, Token, PersonExperience } from '../../models';
import * as statusCodes from '../../constants/statusCodes';

let tokenData;
let token;
let experienceId;
let experience;
let user;
describe('experiences', () => {
  beforeAll(async () => {
    user = await User.findOne({ username: 'admin' });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
    experience = await PersonExperience.create(experienceData);
  });

  describe('create a experience', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/experiences`)
        .send(experienceData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return a `new experience`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/experiences`)
        .set('Authorization', token)
        .send(experienceData);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.experience).toHaveProperty('institution');
    });
  });

  describe('update a experience', () => {
    beforeAll(async () => {
      const res = await request(app)
        .post(`${urlPrefix}/experiences`)
        .set('Authorization', token)
        .send(experienceData);
      experienceId = res.body.experience._id;
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/experiences/${experienceId}`)
        .send(experienceData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/experiences/${experience._id}`)
        .set('Authorization', token)
        .send(experienceData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Server Error`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/experiences/fake-experience-id`)
        .send(experienceData);
      expect(res.status).toBe(statusCodes.SERVER_ERROR);
    });

    test('should return a `updated experience`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/experiences/${experienceId}`)
        .set('Authorization', token)
        .send(experienceData);
      expect(res.status).toBe(statusCodes.OK);
    });
  });

  describe('retreive all experiences', () => {
    test('should return `Experience array`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/experiences`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.experiences).toBeDefined();
    });
  });

  describe('delete a experience', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app).delete(`${urlPrefix}/experiences/${experienceId}`,);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/experiences/${experience._id}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `deleted experience`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/experiences/${experienceId}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
    });
  });
});
