import { Organization } from '../models';
import { statusCodes, responseMessages } from '../constants';

/**
 * @description Organization Controller class
 */
export default class OrganizationsController {

	/**
	 * Get all organizations
	 *
	 * @static
	 * @param {*} req
	 * @param {*} res
	 * @returns {void} organizations
	 * @memberof OrganizationsController
	 */
    static async getAll(req, res) {
        const organizations = await Organization.find({})
            .populate('user')
            .exec();

        return res.status(statusCodes.OK).json({
            status: statusCodes.OK,
            organizations
        });
    }

    /**
	 * Get a single organization
	 *
	 * @static
	 * @param {*} req
	 * @param {*} res
	 * @returns {void} organization
	 * @memberof OrganizationsController
	 */
    static async get(req, res) {
        const { organization } = req;

        return res.status(statusCodes.OK).json({
            status: statusCodes.OK,
            organization
        });
    }

}
