import { Organization } from '../models';
import * as statusCodes from '../constants/statusCodes';
import { notExist } from '../constants/responseMessages';

const checkOrganization = async (req, res, next) => {
  const { organizationId: _id } = req.params;

  if (!/[0-9A-F]{24}$/i.test(_id)) {
    return res.status(statusCodes.BAD_REQUEST).json({
      status: statusCodes.BAD_REQUEST,
      message: 'Wrong Id format',
    });
  }

  const organization = await Organization.findOne({
    _id,
    status: { $ne: 'deleted' },
  })
    .select('-__v')
    .populate(
      'user',
      'picture followerCount followedCount createdAt recommendations username email',
    );

  if (!organization) {
    return res.status(statusCodes.NOT_FOUND).json({
      status: statusCodes.NOT_FOUND,
      message: notExist('Organization'),
    });
  }

  req.organization = organization;

  next();
};

export default checkOrganization;
