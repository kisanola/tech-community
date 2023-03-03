import request from 'supertest';
import app from '../../app';
import {
  notificationData,
  organization as organizationData,
} from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';
import { User, Token, UserNotification } from '../../models';
import * as statusCodes from '../../constants/statusCodes';

let tokenData;
let token;
let orgToken;
let notificationId;
let notification;
let user;
const notificationToken = 'notificationToken';
describe('notifications', () => {
  beforeAll(async () => {
    await User.deleteMany({ username: organizationData.username });
    user = await User.findOne({ username: 'admin' });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
    notificationData.user = user._id;
    notification = await UserNotification.create(notificationData);
    notificationId = notification._id;
    const res = await request(app)
      .post(`${urlPrefix}/auth/signup`)
      .send(organizationData);
    orgToken = `Bearer ${res.body.token}`;
  });

  afterAll(async () => {
    await User.deleteMany({ username: organizationData.username });
  });

  describe('update a notification', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/notifications/token`)
        .send({ notificationToken });
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return a `updated token notification`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/notifications/token`)
        .set('Authorization', token)
        .send({ notificationToken });
      expect(res.status).toBe(statusCodes.OK);
    });
  });

  describe('read a notification', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/notifications/${notificationId}/read`)
        .send({ notificationToken });
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/notifications/${notification._id}/read`)
        .set('Authorization', orgToken)
        .send({ notificationToken });
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/notifications/${notification._id}/read`)
        .set('Authorization', orgToken)
        .send({ notificationToken });
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });
    test('should return a `read notification`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/notifications/${notificationId}/read`)
        .set('Authorization', token)
        .send({ notificationToken });
      expect(res.status).toBe(statusCodes.OK);
    });
  });

  describe('retreive all notifications', () => {
    test('should return `Notifications array`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/notifications`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.userNotifications).toBeDefined();
    });
  });

  describe('delete a notification', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app).delete(`${urlPrefix}/notifications/${notificationId}`,);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/notifications/${notificationId}`)
        .set('Authorization', orgToken);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `deleted notification`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/notifications/${notificationId}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
    });
  });
});
