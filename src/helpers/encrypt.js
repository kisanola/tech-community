import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Token from '../models/Token';

const { JWT_SECRET } = process.env;

/**
 * A helper class to hash password and compare hashed password
 */
class Authentication {
  /**
   * hashPassword Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }

  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} returns True or False
   */
  static comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  }

  /**
   * @param  {Object} _id
   * @returns  {string}} {expiresIn
   */
  static async generateToken(_id) {
    const token = jwt.sign({ _id }, JWT_SECRET, { expiresIn: '2d' });
    await Token.create({
      user: _id,
      token,
    });
    return token;
  }
}

export default Authentication;
