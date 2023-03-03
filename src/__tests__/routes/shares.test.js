import request from 'supertest';
import app from '../../app';
import { postData, organizationShare } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';
import { User, Token, Post } from '../../models';
import * as statusCodes from '../../constants/statusCodes';
import slugString from '../../helpers/slugString';

let token;
let post;
describe('Shares', () => {
  beforeAll(async () => {
    const user1 = await User.findOne({ username: 'admin' });
    const tokenData = await Token.findOne({ user: user1._id }).sort({
      createdAt: -1,
    });

    token = `Bearer ${tokenData.token}`;
    post = await Post.create({ ...postData, slug: slugString('Test') });
  });

  test('Should share the post ', async () => {
    const res = await request(app)
      .post(`${urlPrefix}/posts/${post.slug}/share/facebook`)
      .set('Authorization', token);

    expect(res.status).toBe(statusCodes.OK);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Post has been updated successfully');
  });

  afterAll(async () => {
    await User.deleteOne({ email: organizationShare.email });
    await app.close();
  });
});
