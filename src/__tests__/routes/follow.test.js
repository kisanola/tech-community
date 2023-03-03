import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { urlPrefix } from '../../__mocks__/variables';
import * as statusCodes from '../../constants/statusCodes';
import { User, Token, Follow } from '../../models';

let user1;
let token;
let tokenData;
const username1 = 'admin';
const username2 = 'user';
describe('Follow', () => {
  beforeAll(async () => {
    user1 = await User.findOne({ username: username1 });
    tokenData = await Token.findOne({ user: user1._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
  });

  describe('Follow users ', () => {
    test('Should follow the user', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/follow/${username2}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.message).toBe('Follow has been created successfully');
    });
    test('Should not follow the same user more than once', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/follow/${username2}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.CONFLICT);
      expect(res.body.message).toBe('You are already a follower of this user');
    });

    test('Should not follow a user who does not exist', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/follow/${username2}4`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe('Username does not exist');
    });

    test('Should not follow when the user is trying to follow themselves', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/follow/${username1}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.BAD_REQUEST);
      expect(res.body.message).toBe('You cannot follow yourself');
    });
  });

  describe('unFollow users ', () => {
    test('Should unfollow the user', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/follow/${username2}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.message).toBe('Follow has been deleted successfully');
    });

    test('Should not unfollow when the user is not following the followed', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/follow/${username2}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe('You are not a follower of this user');
    });
  });
  afterAll(async () => {
    await Follow.deleteMany({});
    await app.close();
    await mongoose.disconnect();
  });
});
