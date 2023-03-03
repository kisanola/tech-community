import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { User, Organization } from '../../models';
import { organization } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';
import app from '../../app';

describe('Organization auth', () => {
  let userId;
  let tokenLog;
  describe('Signup with email', () => {
    test('should sign up the user', async () => {
      const resp = await request(app)
        .post(`${urlPrefix}/auth/signup`)
        .send(organization);
      userId = resp.body.user._id;
      tokenLog = resp.body.token;
      expect(resp.status).toBe(201);
      expect(resp.body).toHaveProperty('token');
    });

    test('should not sign up the user with the username which already exist', async () => {
      const resp = await request(app)
        .post(`${urlPrefix}/auth/signup`)
        .send(organization);
      expect(resp.status).toBe(409);
      expect(resp.body.message).toBe('Username already exist');
    });

    test('should not sign up the user with the email which already exist', async () => {
      const badOrg = organization;
      badOrg.username = 'new_username';
      const resp = await request(app)
        .post(`${urlPrefix}/auth/signup`)
        .send(badOrg);
      expect(resp.status).toBe(409);
      expect(resp.body.message).toBe('Email already exist');
    });
  });

  describe('Email verification', () => {
    const { username, password } = organization;

    test('should not log the user in when the account is not verified', async () => {
      const resp = await request(app)
        .post(`${urlPrefix}/auth/login`)
        .send({ username, password });
      expect(resp.status).toBe(403);
      expect(resp.body.message).toBe('Check your email for account verification');
    });

    test('should verify the account', async () => {
      const resp = await request(app).get(`${urlPrefix}/auth/verification/${tokenLog}`);
      expect(resp.status).toBe(200);
      expect(resp.body.message).toBe('Your account has been verified successfully');
    });

    test('should not verify the account when it is already verified', async () => {
      const resp = await request(app).get(`${urlPrefix}/auth/verification/${tokenLog}`);
      expect(resp.status).toBe(400);
      expect(resp.body.message).toBe('Your account has already been verified');
    });

    test('should not verify the account when the token has expired', async () => {
      const expiredToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '0.1s',
      });
      const resp = await request(app).get(`${urlPrefix}/auth/verification/${expiredToken}`);
      expect(resp.status).toBe(401);
      expect(resp.body.message).toBe('Your verification email has expired, try to login to receive a new one');
    });
  });

  describe('login with username or email verification', () => {
    test('should log the user in', async () => {
      const resp = await request(app)
        .post(`${urlPrefix}/auth/login`)
        .send({ username: 'company_name', password: 'CompanyName123' });
      expect(resp.status).toBe(200);
      expect(resp.body).toHaveProperty('token');
    });

    test('should not log the user in with wrong credentials', async () => {
      const resp = await request(app)
        .post(`${urlPrefix}/auth/login`)
        .send({ username: 'company', password: 'CompanyN1233' });
      expect(resp.status).toBe(401);
      expect(resp.body.message).toBe('The credentials you provided are incorrect');
    });
  });

  describe('organizations model', () => {
    it('gets all available organizations', async () => {
      const resp = await request(app)
        .get(`${urlPrefix}/organizations`);
      expect(resp.status).toBe(200);
      expect(resp.body.organizations[0].name).toBe('company name');
    });

    it('gets a single organization', async () => {
      const resp = await request(app)
        .get(`${urlPrefix}/organizations/${userId}`);
      expect(resp.status).toBe(200);
      expect(resp.body.organization.name).toBe('company name');
    });

    it('Returns a message when an organization is not found', async () => {
      const resp = await request(app)
        .get(`${urlPrefix}/organizations/9cef8a70a12d893fd282dfb8`);
      expect(resp.status).toBe(404);
      expect(resp.body.message).toBe('Organization does not exist');
    });

    it('Returns a message when an organization Id format is invalid', async () => {
      const resp = await request(app)
        .get(`${urlPrefix}/organizations/wrongFormatOrganizationID`);
      expect(resp.status).toBe(400);
      expect(resp.body.message).toBe('Wrong Id format');
    });
  })

  afterAll(async () => {
    await User.deleteOne({ email: organization.email });
    await Organization.deleteMany({});
    await app.close();
    await mongoose.disconnect();
  });
});
