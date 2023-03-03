import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRET } = process.env;

const verifyToken = (req, res, next) => {
  try {
    const { token } = req.params;
    const jwtPayload = jwt.verify(token, JWT_SECRET);

    req.jwtPayload = jwtPayload;

    next();
  } catch (err) {
    let { message } = err;
    if (message === 'jwt expired') {
      message =
        'Your verification email has expired, try to login to receive a new one';
    }
    return res.status(401).json({
      message,
    });
  }
};

export default verifyToken;
