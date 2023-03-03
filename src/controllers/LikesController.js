import { Like } from '../models';
import { statusCodes, responseMessages } from '../constants';

/**
 * @description Like Controller class
 */
export default class LikesController {

	/**
	 * Likes a post
	 *
	 * @static
	 * @param {*} req
	 * @param {*} res
	 * @returns {void} post
	 * @memberof LikesController
	 */
  static async likePost(req, res) {
    const { currentUser, post } = req;

    const liked = await Like.findOne({ post: post.id, user: currentUser._id });
    if (liked) {
      return res.status(statusCodes.CONFLICT).json({
        status: statusCodes.CONFLICT,
        message: responseMessages.alreadyLike('post'),
      });
    }

    await Like.create({
      user: currentUser._id,
      post: post.id,
    });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      message: 'Post successfully liked'
    });

  }

  /**
	 * Unlikes a post
	 *
	 * @static
	 * @param {*} req
	 * @param {*} res
	 * @returns {void} post
	 * @memberof LikesController
	 */
  static async unlikePost(req, res) {
    const { currentUser, post } = req;

    const liked = await Like.findOne({ post: post.id, user: currentUser._id });
    if (!liked) {
      return res.status(statusCodes.CONFLICT).json({
        status: statusCodes.CONFLICT,
        message: responseMessages.notLiked('post'),
      });
    }

    await Like.deleteOne({ _id: liked._id });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      message: 'Post successfully unliked'
    });

  }
}