import request from 'supertest';
import app from '../../app';
import { projectData } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';
import { User, Token, PersonProject } from '../../models';
import * as statusCodes from '../../constants/statusCodes';

let tokenData;
let token;
let projectId;
let project;
let user;
describe('projects', () => {
  beforeAll(async () => {
    user = await User.findOne({ username: 'admin' });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
    project = await PersonProject.create(projectData);
  });

  describe('create a project', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/projects`)
        .send(projectData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return a `new project`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/projects`)
        .set('Authorization', token)
        .send(projectData);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.project).toHaveProperty('owner');
    });
  });

  describe('update a project', () => {
    beforeAll(async () => {
      const res = await request(app)
        .post(`${urlPrefix}/projects`)
        .set('Authorization', token)
        .send(projectData);
      projectId = res.body.project._id;
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/projects/${projectId}`)
        .send(projectData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/projects/${project._id}`)
        .set('Authorization', token)
        .send(projectData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Server Error`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/projects/fake-project-id`)
        .send(projectData);
      expect(res.status).toBe(statusCodes.SERVER_ERROR);
    });

    test('should return a `updated project`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/projects/${projectId}`)
        .set('Authorization', token)
        .send(projectData);
      expect(res.status).toBe(statusCodes.OK);
    });
  });

  describe('retreive all projects', () => {
    test('should return `Project array`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/projects`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.projects).toBeDefined();
    });
  });

  describe('delete a project', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app).delete(`${urlPrefix}/projects/${projectId}`,);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/projects/${project._id}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `deleted project`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/projects/${projectId}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
    });
  });
});
