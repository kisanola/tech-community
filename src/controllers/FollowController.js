import { User, Follow } from '../models';
import { statusCodes, responseMessages } from '../constants';

/**
 * @description Experience Controller class
 */
export default class FollowController {
  /**
   * @author Karl Musingo
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Returns the response
   */
  static async follow(req, res) {
    const { currentUser, followedUser } = req;

    const existFollow = await Follow.findOne({
      follower: currentUser._id,
      followed: followedUser._id,
    });

    if (existFollow) {
      return res.status(statusCodes.CONFLICT).json({
        status: statusCodes.CONFLICT,
        message: 'You are already a follower of this user',
      });
    }

    const follow = await Follow.create({
      follower: currentUser._id,
      followed: followedUser._id,
    });

    await User.updateOne(
      { _id: followedUser._id },
      { followerCount: followedUser.followerCount + 1 },
    );
    await User.updateOne(
      { _id: currentUser._id },
      { followedCount: currentUser.followedCount + 1 },
    );

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      follow,
      message: responseMessages.created('Follow'),
    });
  }

  /**
   * @author Karl Musingo
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Returns the response
   */
  static async unFollow(req, res) {
    const { currentUser, followedUser } = req;

    const unFollow = await Follow.findOneAndDelete({
      follower: currentUser._id,
      followed: followedUser._id,
    });

    if (!unFollow) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: statusCodes.NOT_FOUND,
        message: 'You are not a follower of this user',
      });
    }

    await User.updateOne(
      { _id: followedUser._id },
      { followerCount: followedUser.followerCount - 1 },
    );
    await User.updateOne(
      { _id: currentUser._id },
      { followedCount: currentUser.followedCount - 1 },
    );

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      unFollow,
      message: responseMessages.deleted('Follow'),
    });
  }
}
