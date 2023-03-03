import request from 'supertest';
import app from '../../app';
import { profileData } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';
import { Token } from '../../models';
import * as statusCodes from '../../constants/statusCodes';
import User from '../../models/User';

let tokenData;
let token;
const username = 'admin';
let user;
describe('profiles', () => {
  beforeAll(async () => {
    user = await User.findOne({ username });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
  });

  describe('update a profile', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/profiles/${username}`)
        .send(profileData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Profile does not exist`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/profiles/fake-username`)
        .send(profileData);
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe('Profile does not exist');
    });

    test('should return a `updated profile`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/profiles/${username}`)
        .set('Authorization', token)
        .send(profileData);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.profile).toHaveProperty('username');
    });
  });

  describe('retreive a profile', () => {
    test('should return `Profile does not exist`', async () => {
      const res = await request(app).get(`${urlPrefix}/profiles/fake-username`);
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe('Profile does not exist');
    });

    test('should return `a profile`', async () => {
      const res = await request(app).get(`${urlPrefix}/profiles/${username}`);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.profile).toHaveProperty('username');
    });
  });

  describe('retreive all profiles', () => {
    test('should return `Profile array`', async () => {
      const res = await request(app).get(`${urlPrefix}/profiles`);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.profiles).toBeDefined();
    });
  });
});
