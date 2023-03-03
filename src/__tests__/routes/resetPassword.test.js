import request from 'supertest';
import { User, Token } from '../../models';
import { urlPrefix } from '../../__mocks__/variables';
import app from '../../app';

describe('Reset password', () => {
  let token;
  let user;
  beforeAll(async () => {
    user = await User.findOne({ username: 'admin' });
    const tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
  });

  test('should send the reset password link', async () => {
    const resp = await request(app)
      .post(`${urlPrefix}/auth/password`)
      .send({ email: user.email });
    expect(resp.status).toBe(200);
    expect(resp.body.data).toHaveProperty('token');
  });

  test('should not send the reset password link when the email does not exist', async () => {
    const resp = await request(app)
      .post(`${urlPrefix}/auth/password`)
      .send({ email: `k${user.email}` });
    expect(resp.status).toBe(404);
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe('email does not exist');
  });

  test('should not reset the password with the same password', async () => {
    const resp = await request(app)
      .put(`${urlPrefix}/auth/password`)
      .set('Authorization', token)
      .send({ password: 'Admin123456' });
    expect(resp.status).toBe(400);
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe('New password must be different from the current',);
  });

  test('should reset the passord', async () => {
    const resp = await request(app)
      .put(`${urlPrefix}/auth/password`)
      .set('Authorization', token)
      .send({ password: 'Admin123456New' });
    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe('Password has been updated successfully');
  });
});
