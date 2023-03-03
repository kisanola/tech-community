import { PostComment } from '../models';
import { statusCodes, responseMessages } from '../constants';
import { PAGE_LIMIT } from '../constants/shared';
import { notifEvents } from '../middlewares/registerEvents';

/**
 * @description PostComment Controller class
 */
export default class PostCommentController {
  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async createPostComment(req, res) {
    const { currentUser, body, post, token } = req;
    body.author = currentUser._id;
    body.post = post._id;
    const postComment = await PostComment.create(body);

    notifEvents.emit('post-commented', {
      currentUser: currentUser.toObject(),
      token: token.toObject(),
      post: post.toObject(),
      action: 'commented',
    });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      postComment,
      message: responseMessages.created('Post Comment'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async updatePostComment(req, res) {
    const { currentUser, body, postComment } = req;

    if (!currentUser._id.equals(postComment.author)) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        status: statusCodes.UNAUTHORIZED,
        message: responseMessages.unauthorized(),
      });
    }

    await postComment.updateOne(body);

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      postComment: {
        ...postComment.toObject(),
        ...body,
      },
      message: responseMessages.updated('Post Comment'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async deletePostComment(req, res) {
    const { currentUser, postComment } = req;

    if (!currentUser._id.equals(postComment.author)) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        status: statusCodes.UNAUTHORIZED,
        message: responseMessages.unauthorized(),
      });
    }

    await postComment.updateOne({ status: 'deleted' });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      postComment,
      message: responseMessages.deleted('Post Comment'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async getAllPostComments(req, res) {
    const {
      post: { _id: post },
    } = req;
    const { page = 1 } = req.query;

    const comments = await PostComment.paginate(
      {
        post,
        status: {
          $ne: 'deleted',
        },
      },
      {
        populate: [{ path: 'author', select: 'username email picture' }],
        limit: PAGE_LIMIT,
        offset: page - 1,
      },
    );

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      ...comments,
      postComments: comments.docs,
      docs: undefined,
      offset: undefined,
      limit: undefined,
      page,
    });
  }
}
