import { User, Person } from '../models';
import { statusCodes, responseMessages } from '../constants';
import { PAGE_LIMIT } from '../constants/shared';
import { notifEvents } from '../middlewares/registerEvents';
/**
 * @description Profile Controller class
 */
export default class ProfileController {
  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async updateProfile(req, res) {
    const { currentUser, body, profile } = req;

    if (currentUser.username !== profile.username) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        status: statusCodes.UNAUTHORIZED,
        message: responseMessages.unauthorized(),
      });
    }

    const person = await Person.updateOne({ user: currentUser._id }, body, {
      upsert: true,
    });

    if (!currentUser.info) {
      await currentUser.updateOne({ info: person.upserted[0]._id });
    }

    notifEvents.emit('update-index', {
      title: `${person.firstName} ${person.middleName} ${person.lastName}`
        .replace('  ', ' ')
        .trim(),
      objectID: currentUser.username,
      resource: 'user',
      keywords: `${person.firstName} ${person.lastName}`,
    });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      profile,
      message: responseMessages.created('Profile'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async getProfile(req, res) {
    const { profile } = req;

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      profile,
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async getProfiles(req, res) {
    const { page = 1 } = req.query;
    const profiles = await User.paginate(
      {
        status: 'active',
      },
      {
        select: 'username email picture city country info',
        populate: 'info',
        limit: PAGE_LIMIT,
        offset: page - 1,
      },
    );

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      ...profiles,
      profiles: profiles.docs,
      docs: undefined,
      offset: undefined,
      limit: undefined,
      page,
    });
  }
}
