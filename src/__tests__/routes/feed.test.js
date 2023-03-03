import request from 'supertest';
import app from '../../app';
import { urlPrefix } from '../../__mocks__/variables';
import * as statusCodes from '../../constants/statusCodes';

describe('Feeds', () => {
  describe('Home Feeds', () => {
    test('Should get Feeds', async () => {
      const res = await request(app).get(`${urlPrefix}/feed`);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.feed).toEqual(expect.any(Array));
    });

    test('Should get organization feeds', async () => {
      const res = await request(app).get(`${urlPrefix}/feed/organization`);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.feed).toEqual(expect.any(Array));
    });
  });
});
