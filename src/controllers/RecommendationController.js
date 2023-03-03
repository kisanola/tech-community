import { Recommendation } from '../models';
import { statusCodes, responseMessages } from '../constants';

/**
 * @description Re Controller class
 */
export default class RecommendationController {

  /**
   * Recommend a user
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} recommendation
   * @memberof RecommendationController
   */
  static async createRecommendation(req, res) {
    const { currentUser, receiver } = req;
    const { description } = req.body;

    if (currentUser._id.toString() === receiver.id) {
      return res.status(statusCodes.FORBIDDEN).json({
        status: statusCodes.FORBIDDEN,
        message: responseMessages.notAllowed('You are', 'recommend yourself'),
      });
    }

    const recommendation = await Recommendation.create({
      from: currentUser._id,
      to: receiver.id,
      description,
    });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      recommendation
    });

  }

  /**
   * Enables the user to approve a recommendation
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {void} recommendation
   * @memberof RecommendationController
   */
  static async approveRecommendation(req, res) {
    const { currentUser } = req;
    const { recommendationId: id } = req.params;

    const recommendation = await Recommendation.findOne({ _id: id });

    if (!recommendation) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: statusCodes.NOT_FOUND,
        message: responseMessages.notExist('The recommendation'),
      });
    }

    if (currentUser.id.toString() !== recommendation.to.toString()) {
      return res.status(statusCodes.FORBIDDEN).json({
        status: statusCodes.NOT_FOFORBIDDENUND,
        message: responseMessages.notAllowed('You are', 'approve this recommendation'),
      });
    }

    await Recommendation.updateOne({ _id: id }, { accepted: true });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      recommendation: { ...recommendation.toObject(), accepted: true }
    });

  }

  /**
   * Enables the user to disapprove a recommendation
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {void} recommendation
   * @memberof RecommendationController
   */
  static async disapproveRecommendation(req, res) {
    const { currentUser } = req;
    const { recommendationId: id } = req.params;

    const recommendation = await Recommendation.findOne({ _id: id });

    if (!recommendation) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: statusCodes.NOT_FOUND,
        message: responseMessages.notExist('The recommendation'),
      });
    }

    if (currentUser.id.toString() !== recommendation.to.toString()) {
      return res.status(statusCodes.FORBIDDEN).json({
        status: statusCodes.NOT_FOFORBIDDENUND,
        message: responseMessages.notAllowed('You are', 'disapprove this recommendation'),
      });
    }

    await Recommendation.updateOne({ _id: id }, { accepted: false });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      recommendation: { ...recommendation.toObject(), accepted: false }
    });

  }

  /**
   * Enables the user to update a recommendation
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {void} recommendation
   * @memberof RecommendationController
   */
  static async updateRecommendation(req, res) {
    const { currentUser } = req;
    const { description } = req.body;
    const { recommendationId: id } = req.params;

    const recommendation = await Recommendation.findOne({ _id: id });

    if (!recommendation) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: statusCodes.NOT_FOUND,
        message: responseMessages.notExist('The recommendation'),
      });
    }

    if (currentUser.id.toString() !== recommendation.from.toString()) {
      return res.status(statusCodes.FORBIDDEN).json({
        status: statusCodes.NOT_FOFORBIDDENUND,
        message: responseMessages.notAllowed('You are', 'update this recommendation'),
      });
    }

    await Recommendation.updateOne({ _id: id }, { description });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      recommendation: { ...recommendation.toObject(), description }
    });

  }

  /**
   * Get user recommendations
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} recommendations
   * @memberof RecommendationController
   */
  static async getRecommendation(req, res) {
    const { receiver: user } = req;

    const recommendations = await Recommendation.find({ to: user.id });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      recommendations
    });
  }

}