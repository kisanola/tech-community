import dotenv from 'dotenv';
import User from '../models/User';
import Person from '../models/Person';
import { encrypt, sendMail } from '../helpers';
import Organization from '../models/Organization';
import {
  CREATED,
  OK,
  BAD_REQUEST,
  FORBIDDEN,
  UNAUTHORIZED,
} from '../constants/statusCodes';

dotenv.config();

/**
 * Contains the authentification routes
 *
 * @class Auth
 */
class AuthController {
  /**
   * Checks whether the user exists,
   * if not, a new one is created,
   * else the same user is returned
   *
   * @static
   * @param {*} res
   * @param {*} providerUser
   * @returns {object} user
   * @memberof User
   */
  static async findOrCreate(res, providerUser) {
    const {
      id,
      email,
      picture,
      displayName,
      name,
    } = AuthController.fromProvider(providerUser);

    const getUser = userId =>
      Person.findById(userId)
        .populate('user')
        .exec();

    const username = displayName.replace(/\s+/g, '') + id.substr(0, 5);

    let person = await Person.findOne({ providerId: id });
    let user = await User.findOne({ email });
    let status = OK;

    if (person == null && user == null) {
      user = await User.create({
        username,
        email,
        picture,
      });

      const { givenName, familyName } = name;

      person = await Person.create({
        providerId: id,
        firstName: givenName,
        lastName: familyName,
        user: user.id,
      });
      status = CREATED;
    }
    
    person = person || (await Person.findOne({ user: user.id }));
    user = await getUser(person.id);

    const token = encrypt.generateToken({ id: user.id });

    return res.status(status).json({
      user,
      token,
    });
  }

  /**
   * Authentificate the user
   * from social login
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof Auth
   * @return {void}
   */
  static async socialAuth(req, res) {
    await AuthController.findOrCreate(res, req.user);
  }

  /**
   * Adds different fields to the user
   *
   * @static
   * @param {*} user
   * @returns {object} user
   * @memberof Auth
   */
  static fromProvider(user) {
    return {
      ...user,
      name: user.name || { givenName: null, familyName: null },
      email: user.emails ? user.emails[0].value : null,
      picture: user.photos[0].value,
    };
  }

  /**
   * signup only for organizations
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof Auth
   */
  static async signup(req, res) {
    const hashedPassword = encrypt.hashPassword(req.body.password);
    const { companyName, username, email } = req.body;

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const organization = await Organization.create({
      name: companyName,
      user: user.id,
    });

    const getUser = id =>
      Organization.findById(id)
        .populate('user')
        .exec();

    const result = await getUser(organization.id);

    const token = encrypt.generateToken({ id: user._id });
    if (process.env.NODE_ENV !== 'test') {
      await sendMail(email, companyName, token);
    }

    return res.status(CREATED).json({
      status: CREATED,
      user: result,
      token,
    });
  }

  /**
   * login only for organizations
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof Auth
   */
  static async login(req, res) {
    const { username, password } = req.body;

    const user = await User.findOne().or([{ username }, { email: username }]);

    if (!user || !encrypt.comparePassword(user.password, password)) {
      return res.status(UNAUTHORIZED).json({
        status: UNAUTHORIZED,
        message: 'The credentials you provided are incorrect',
      });
    }

    const token = encrypt.generateToken({ id: user.id });

    if (!user.verified) {
      if (process.env.NODE_ENV !== 'test') {
        await sendMail(user.email, username, token);
      }
      return res.status(FORBIDDEN).json({
        status: FORBIDDEN,
        message: 'Check your email for account verification',
      });
    }

    const getUser = userId =>
      Organization.findOne({ user: userId })
        .populate('user')
        .exec();

    const result = await getUser(user.id);

    return res.status(OK).json({
      status: OK,
      user: result,
      token,
    });
  }

  /**
   * verify the account from the email
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof Auth
   */
  static async verification(req, res) {
    const { id } = req.jwtPayload;
    const user = await User.findOne({
      _id: id,
    });

    if (user.verified) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        message: 'Your account has already been verified',
      });
    }
    await User.updateOne({ _id: id }, { verified: true });
    return res.status(OK).json({
      status: OK,
      message: 'Your account has been verified successfully',
    });
  }
}

export default AuthController;
