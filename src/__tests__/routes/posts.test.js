import request from 'supertest';
import app from '../../app';
import { postData } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';
import { User, Token, Post } from '../../models';
import { statusCodes, responseMessages } from '../../constants';
import slugString from '../../helpers/slugString';


let tokenData;
let token;
let postSlug;
let post;
let user;
describe('posts', () => {
  beforeAll(async () => {
    user = await User.findOne({ username: 'admin' });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
    post = await Post.create({ ...postData, slug: slugString('Test') });
  });

  describe('create a post', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/posts`)
        .send(postData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return a `new post`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/posts`)
        .set('Authorization', token)
        .send(postData);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.post).toHaveProperty('title');
    });
  });

  describe('update a post', () => {
    beforeAll(async () => {
      const res = await request(app)
        .post(`${urlPrefix}/posts`)
        .set('Authorization', token)
        .send(postData);
      postSlug = res.body.post.slug;
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/posts/${postSlug}`)
        .send(postData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/posts/${post.slug}`)
        .set('Authorization', token)
        .send(postData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Post does not exist`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/posts/fake-post-slug`)
        .send(postData);
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe('Post does not exist');
    });

    test('should return a `updated post`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/posts/${postSlug}`)
        .set('Authorization', token)
        .send(postData);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.post).toHaveProperty('title');
    });
  });

  describe('like a post', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/posts/postSlug/like`)
        .send(postData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should like a post', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/posts/${postSlug}/like`)
        .set('Authorization', token)
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.message).toBe('Post successfully liked');
    });

    test('should return a conflict', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/posts/${postSlug}/like`)
        .set('Authorization', token)
      expect(res.status).toBe(statusCodes.CONFLICT);
      expect(res.body.message).toBe(responseMessages.alreadyLike('post'));
    });
  });

  describe('unlike a post', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/posts/postSlug/like`)
        .send(postData);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should like a post', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/posts/${postSlug}/like`)
        .set('Authorization', token)
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.message).toBe('Post successfully unliked');
    });

    test('should return a conflict', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/posts/${postSlug}/like`)
        .set('Authorization', token)
      expect(res.status).toBe(statusCodes.CONFLICT);
      expect(res.body.message).toBe(responseMessages.notLiked('post'));
    });
  });

  describe('retreive a post', () => {
    beforeAll(async () => {
      const res = await request(app)
        .post(`${urlPrefix}/posts`)
        .set('Authorization', token)
        .send(postData);
      postSlug = res.body.post.slug;
    });

    test('should return `Post does not exist`', async () => {
      const res = await request(app).get(`${urlPrefix}/posts/fake-post-slug`);
      expect(res.status).toBe(statusCodes.NOT_FOUND);
      expect(res.body.message).toBe('Post does not exist');
    });

    test('should return `a post`', async () => {
      const res = await request(app).get(`${urlPrefix}/posts/${postSlug}`);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.post).toHaveProperty('title');
    });
  });

  describe('retreive all posts', () => {
    test('should return `Post array`', async () => {
      const res = await request(app).get(`${urlPrefix}/posts`);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.posts).toBeDefined();
    });
  });

  describe('delete a post', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app).delete(`${urlPrefix}/posts/${postSlug}`);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/posts/${post.slug}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Unauthorized access');
    });

    test('should return `deleted post`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/posts/${postSlug}`)
        .set('Authorization', token);
      expect(res.status).toBe(statusCodes.OK);
      expect(res.body.post).toHaveProperty('title');
    });
  });
});
