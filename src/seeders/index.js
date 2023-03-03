import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { logger } from '../helpers';
import { connectDb, User, Token } from '../models';
import users from './users';
import encrypt from '../helpers/encrypt';

const { JWT_SECRET } = process.env;

const seedUsers = async () => {
  return new Promise(resolve => {
    users.forEach(async (val, index) => {
      const password = encrypt.hashPassword('Admin123456');
      await User.updateOne(
        { email: val.email },
        { ...val, password },
        { upsert: true, setDefaultsOnInsert: true },
      );
      const user = await User.findOne({ email: val.email });
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      logger.info(`username: ${user.username}, Token ${index + 1}: ${token}`);
      await Token.create({ user: user._id, token });
      if (users.length >= index + 1) {
        resolve(true);
      }
    });
  });
};

const exitProcess = (code = 0) => {
  logger.info('Seeding ended!');
  process.exit(code);
};

connectDb()
  .then(() => {
    logger.info('Seeding started!');
    seedUsers()
      .then(() => {
        exitProcess();
      })
      .catch(() => {
        exitProcess(1);
      });
  })
  .catch(err => {
    logger.error(`Failed! ${err.message}`);
    process.exit();
  });
