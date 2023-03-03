import { UserNotification } from '../models';
import { NOT_FOUND } from '../constants/statusCodes';
import { notExist } from '../constants/responseMessages';

const checkUserNotification = async (req, res, next) => {
  const { userNotificationId: _id } = req.params;

  const foundUserNotification = await UserNotification.findOne({
    _id,
  });

  if (!foundUserNotification) {
    return res.status(NOT_FOUND).json({
      status: NOT_FOUND,
      message: notExist('Notification'),
    });
  }

  req.userNotification = foundUserNotification;

  next();
};

export default checkUserNotification;
