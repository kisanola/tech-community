import request from 'supertest';
import app from '../../app';
import { postData, postCommentData } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';
import { User, Token, Post, PostComment } from '../../models';
import * as statusCodes from '../../constants/statusCodes';

let tokenData;
let token;
let postCommentId;
let postComment;
let post;
let user;
describe('postComments', () => {
  beforeAll(async () => {
    user = await User.findOne({ username: 'admin' });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;

    post = await Post.create(postData);
    postComment = await PostComment.create({
      ...postCommentData,
      post: post._id,
    });
  });

  describe('create a postComment', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/posts/${post.slug}/Comments`)
        .send(postCommentData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return a `new postComment`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/posts/${post.slug}/comments`)
        .set('Authorization', token)
        .send(postCommentData);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.postComment).toHaveProperty('body');
    });
  });

  describe('update a postComment', () => {
    beforeAll(async () => {
      const res = await request(app)
        .post(`${urlPrefix}/posts/${post.slug}/comments`)
        .set('Authorization', token)
        .send(postCommentData);
      postCommentId = res.body.postComment._id;
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/posts/${post.slug}/comments/${postCommentId}`)
        .send(postCommentData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/posts/${post.slug}/comments/${postComment._id}`)
        .set('Authorization', token)
        .send(postCommentData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Server Error`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/posts/${post.slug}/comments/fake-postComment-id`)
        .set('Authorization', token)
        .send(postCommentData);
      expect(res.status).toBe(statusCodes.SERVER_ERROR);
    });

    test('should return a `updated postComment`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/posts/${post.slug}/comments/${postCommentId}`)
        .set('Authorization', token)
        .send(postCommentData);
      expect(res.status).toBe(statusCodes.OK);
    });
  });

  describe('retreive all postComments', () => {
    test('should return `Post comment array`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/posts/${post.slug}/comments`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.postComments).toBeDefined();
    });
  });

  describe('delete a postComment', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app).delete(`${urlPrefix}/posts/${post.slug}/comments/${postCommentId}`,);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/posts/${post.slug}/comments/${postComment._id}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `deleted postComment`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/posts/${post.slug}/comments/${postCommentId}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
    });
  });
});
