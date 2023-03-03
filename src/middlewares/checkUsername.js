import { User } from '../models';
import * as statusCodes from '../constants/statusCodes';
import { notExist } from '../constants/responseMessages';

const checkUsername = async (req, res, next) => {
  const { username } = req.params;
  const { currentUser } = req;
  if (username === currentUser.username) {
    return res.status(statusCodes.BAD_REQUEST).json({
      status: statusCodes.BAD_REQUEST,
      message: 'You cannot follow yourself',
    });
  }
  const user = await User.findOne({
    username,
  });

  if (!user) {
    return res
      .status(statusCodes.NOT_FOUND)
      .json({ status: statusCodes.NOT_FOUND, message: notExist('Username') });
  }

  req.followedUser = user;

  next();
};

export default checkUsername;
