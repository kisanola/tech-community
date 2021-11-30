import { Person, PersonEducation } from '../models';
import { statusCodes, responseMessages } from '../constants';

/**
 * @description Education Controller class
 */
export default class EducationController {
  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<any>} Returns the response
   */
  static async createEducation(req, res) {
    const { currentUser, body } = req;
    body.user = currentUser._id;
    const education = await PersonEducation.create(body);

    await Person.updateOne(
      { user: currentUser._id },
      { $push: { educations: education._id } },
    );

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      education,
      message: responseMessages.created('Education'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<any>} Returns the response
   */
  static async updateEducation(req, res) {
    const { currentUser, body, personEducation } = req;

    if (!currentUser._id.equals(personEducation.user)) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        status: statusCodes.UNAUTHORIZED,
        message: responseMessages.unauthorized(),
      });
    }

    await personEducation.updateOne(body);

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      personEducation: {
        ...personEducation.toObject(),
        ...body,
      },
      message: responseMessages.updated('Education'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<any>} Returns the response
   */
  static async deleteEducation(req, res) {
    const { currentUser, personEducation } = req;

    if (!currentUser._id.equals(personEducation.user)) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        status: statusCodes.UNAUTHORIZED,
        message: responseMessages.unauthorized(),
      });
    }

    await personEducation.deleteOne();

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      personEducation,
      message: responseMessages.deleted('Education'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async getAllEducations(req, res) {
    const {
      currentUser: { _id: user },
    } = req;

    const educations = await PersonEducation.find({ user });
    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      educations,
    });
  }
}
