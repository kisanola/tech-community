import request from 'supertest';
import app from '../../app';
import { urlPrefix } from '../../__mocks__/variables';
import * as statusCodes from '../../constants/statusCodes';
import { User, Token } from '../../models';
import { notExist, unauthorized } from '../../constants/responseMessages';

const message = 'lorem ipsum dolor sit amet';

let user;
let token;
let tokenData;
const username = 'admin';
describe('Chats', () => {
  beforeAll(async () => {
    user = await User.findOne({ username });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
  });

  describe('Send a message to a user ', () => {
    test('Should send a new message', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/chats/${username}`)
        .set('Authorization', token)
        .send({ body: message });
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.chat.body).toBe(message);
    });

    test('Should fail to send if the receiver does not exist', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/chats/not-exist`)
        .set('Authorization', token)
        .send({ body: message });
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe(notExist('The user'));
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/chats/not-exist`)
        .send({ body: message });
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe(unauthorized());
    });
  });

  describe('Get user chats ', () => {
    test('Should a user chats', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/chats/${username}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
    });

    test('Should fail to get the user chats if the user does not exist', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/chats/not-exist`)
        .set('Authorization', token)
        .send({ body: message });
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe(notExist('The user'));
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/chats/not-exist`)
        .send({ body: message });
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe(unauthorized());
    });
  });
});
