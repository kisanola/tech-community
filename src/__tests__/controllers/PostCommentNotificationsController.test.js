import PostCommentNotificationController from '../../controllers/PostCommentNotificationController';

describe('PostCommentNotificationController', () => {
  test('should call postCommented()', async () => {
    const post = {
      title: 'title',
      slug: 'slug',
      author: {
        _id: 'id',
      },
    };
    const token = {};
    const currentUser = {
      username: 'username',
    };

    const data = await PostCommentNotificationController.postActions({
      post,
      token,
      currentUser,
      action: 'commented',
    });

    expect(data).toHaveProperty('link');
  });
});
