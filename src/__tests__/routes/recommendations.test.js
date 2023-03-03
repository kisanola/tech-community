import request from 'supertest';
import app from '../../app';
import { recommendationDescritption } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';
import { User, Token } from '../../models';
import { statusCodes, responseMessages } from '../../constants';

let tokenData;
let token;
let user;
let recommededTokenData, recommededUsertoken, recommendedUser;
const recommendation = { id: null };
beforeAll(async () => {
  user = await User.findOne({ username: 'admin' });
  tokenData = await Token.findOne({ user: user._id }).sort({
    createdAt: -1,
  });
  token = `Bearer ${tokenData.token}`;

  recommendedUser = await User.findOne({ username: 'lungu' });
  recommededTokenData = await Token.findOne({
    user: recommendedUser._id,
  }).sort({
    createdAt: -1,
  });
  recommededUsertoken = `Bearer ${recommededTokenData.token}`;
});

describe('Recommendations', () => {
  describe('User recommendation', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/recommendations/${recommendedUser.username}`)
        .send(recommendationDescritption);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should recommend a user', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/recommendations/lungu`)
        .set('Authorization', token)
        .send(recommendationDescritption);
      recommendation.id = res.body.recommendation._id;
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.recommendation.description).toBe(recommendationDescritption.description,);
    });

    test('should not find the user', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/recommendations/not-found`)
        .set('Authorization', token)
        .send(recommendationDescritption);
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe(responseMessages.notExist('The user'));
    });

    test('should forbid a user to recommend himself', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/recommendations/${user.username}`)
        .set('Authorization', token)
        .send(recommendationDescritption);
      expect(res.status).toBe(statusCodes.FORBIDDEN);
      expect(res.body.message).toBe(responseMessages.notAllowed('You are', 'recommend yourself'),);
    });
  });

  describe('Recommendation approval', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/recommendations/${recommendation.id}/approve`)
        .send(recommendationDescritption);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should approve a recommendation', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/recommendations/${recommendation.id}/approve`)
        .set('Authorization', recommededUsertoken);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.recommendation.accepted).toBe(true);
    });

    test('should not find the recommendation', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/recommendations/5cafc73bcba95353169fb518/approve`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe(responseMessages.notExist('The recommendation'),);
    });

    test('should forbid a user to approve not owned recommendations', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/recommendations/${recommendation.id}/approve`)
        .set('Authorization', token)
        .send(recommendationDescritption);
      expect(res.status).toBe(statusCodes.FORBIDDEN);
      expect(res.body.message).toBe(responseMessages.notAllowed('You are', 'approve this recommendation'),);
    });
  });

  describe('Recommendation disapproval', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/recommendations/${recommendation.id}/approve`)
        .send(recommendationDescritption);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should disapprove a recommendation', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/recommendations/${recommendation.id}/approve`)
        .set('Authorization', recommededUsertoken);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.recommendation.accepted).toBe(false);
    });

    test('should not find the recommendation', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/recommendations/5cafc73bcba95353169fb518/approve`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe(responseMessages.notExist('The recommendation'),);
    });

    test('should forbid a user to disapprove not owned recommendations', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/recommendations/${recommendation.id}/approve`)
        .set('Authorization', token)
        .send(recommendationDescritption);
      expect(res.status).toBe(statusCodes.FORBIDDEN);
      expect(res.body.message).toBe(responseMessages.notAllowed(
          'You are',
          'disapprove this recommendation',
        ),);
    });
  });

  describe('Recommendation update', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/recommendations/${recommendation.id}`)
        .send(recommendationDescritption);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should update a recommendation', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/recommendations/${recommendation.id}`)
        .set('Authorization', token)
        .send(recommendationDescritption);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.recommendation.accepted).toBe(false);
    });

    test('should not find the recommendation', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/recommendations/5cafc73bcba95353169fb518`)
        .set('Authorization', token)
        .send(recommendationDescritption);
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe(responseMessages.notExist('The recommendation'),);
    });

    test('should forbid a user to update owned recommendations', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/recommendations/${recommendation.id}`)
        .set('Authorization', recommededUsertoken)
        .send(recommendationDescritption);
      expect(res.status).toBe(statusCodes.FORBIDDEN);
      expect(res.body.message).toBe(responseMessages.notAllowed('You are', 'update this recommendation'),);
    });
  });

  describe('Get user recommendations', () => {
    test('should return an array of recommendations', async () => {
      const res = await request(app).get(`${urlPrefix}/recommendations/${recommendedUser.username}`,);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.recommendations).toEqual(expect.any(Array));
    });
  });
});
