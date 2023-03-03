import { Post } from '../models';
import { statusCodes } from '../constants';

/**
 * @description Feed Controller class
 */
export default class FeedController {
  /**
   * Get all feed
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {void} feed
   * @memberof FeedController
   */
  static async getFeed(req, res) {
    const { offset = 0, limit = 20 } = req.query;

    const posts = await Post.find({})
      .select('-__v')
      .populate('author', '-_id -__v -password');

    const feed = posts
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .filter((item, index) => index > offset && index <= limit);

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      feed,
    });
  }

  /**
   * Get organization feed
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {void} feed
   * @memberof FeedController
   */
  static async getOrganizations(req, res) {
    const { offset = 0, limit = 20 } = req.query;

    const posts = await Post.find({ userType: 'organization' })
      .select('-__v')
      .populate('author', '-_id -__v -password');

    const feed = posts
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .filter((item, index) => index > offset && index <= limit);

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      feed,
    });
  }
}
