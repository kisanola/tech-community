import { EventEmitter } from 'events';
import { UserNotification } from '../models';
import { statusCodes, responseMessages } from '../constants';
import { PAGE_LIMIT } from '../constants/shared';

const notifEvents = new EventEmitter();

/**
 * @description UserNotification Controller class
 */
export default class UserNotificationController {
  /**
   * @author Olivier
   * @param {Object} data
   * @param {*} next
   * @returns {Object} Returns record's data
   */
  static async createUserNotification(data) {
    const userNotification = await UserNotification.create(data);

    return userNotification;
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async updateNotificationToken(req, res) {
    const { token, currentUser } = req;
    const { notificationToken } = req;

    await token.updateOne({ notificationToken });

    notifEvents.emit('register-notification-token', {
      notificationToken,
      currentUser,
    });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      message: responseMessages.updated('Notification Token'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async readUserNotification(req, res) {
    const { currentUser, userNotification } = req;

    if (!currentUser._id.equals(userNotification.user)) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        status: statusCodes.UNAUTHORIZED,
        message: responseMessages.unauthorized(),
      });
    }

    await userNotification.updateOne({ read: true });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      userNotification: {
        ...userNotification.toObject(),
        read: true,
      },
      message: responseMessages.updated('Notification'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async deleteUserNotification(req, res) {
    const { currentUser, userNotification } = req;

    if (!currentUser._id.equals(userNotification.user)) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        status: statusCodes.UNAUTHORIZED,
        message: responseMessages.unauthorized(),
      });
    }

    await userNotification.deleteOne();

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      userNotification,
      message: responseMessages.deleted('Notification'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async getAllUserNotifications(req, res) {
    const {
      currentUser: { _id: user },
    } = req;
    const { page = 1 } = req.query;

    const notifications = await UserNotification.paginate(
      {
        user,
      },
      {
        limit: PAGE_LIMIT,
        offset: page - 1,
      },
    );

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      ...notifications,
      userNotifications: notifications.docs,
      docs: undefined,
      offset: undefined,
      limit: undefined,
      page,
    });
  }
}
