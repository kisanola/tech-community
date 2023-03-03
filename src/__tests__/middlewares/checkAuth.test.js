import request from 'supertest';
import checkAuth from '../../middlewares/checkAuth';
import app from '../../app';
import { Token } from '../../models';

const response = (req, res) =>
  res.json(200).json({ status: 200, message: 'Success' });

app.post('/checkAuth', checkAuth, response);

let token;
let tokenBearer;
jest.setTimeout(30000);

describe('checkAuth.js', () => {
  beforeAll(async () => {
    token = await Token.create({ token: 'token' });
    tokenBearer = `Bearer ${token.token}`;
  });

  it('should return `Unauthorized access`', async () => {
    const res = await request(app)
      .post('/checkAuth')
      .set('Authorization', tokenBearer);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized access');
  });

  it('should return `Authentication required. Please login`', async () => {
    const res = await request(app)
      .post('/checkAuth')
      .set('Authorization', 'Bearer fake-token');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Authentication required. Please login');
  });
});
