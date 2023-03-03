import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User, Token } from '../models';

const { JWT_SECRET } = process.env;

const checkAuth = async (req, res, next) => {
  let user;

  const { authorization = '' } = req.headers;
  const token = authorization.slice(7);
  if (!token) {
    return res
      .status(401)
      .json({ status: 401, message: 'Unauthorized access', authorization });
  }
  // Checks if the token exist in the database
  const foundToken = await Token.findOne({
    token,
  });

  if (!foundToken) {
    return res
      .status(401)
      .json({ status: 401, message: 'Authentication required. Please login' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err || !decoded) {
      return res
        .status(401)
        .json({ status: 401, message: 'Unauthorized access', err });
    }
    user = await User.findOne({
      _id: decoded._id,
      status: 'active',
    });
    if (!user) {
      return res
        .status(401)
        .json({ status: 401, message: 'Unauthorized access for user' });
    }
    req.currentUser = user;
    req.token = foundToken;
    next();
  });
};

export default checkAuth;
