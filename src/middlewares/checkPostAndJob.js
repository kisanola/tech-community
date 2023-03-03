import { Post} from '../models';
import * as statusCodes from '../constants/statusCodes';
import { notExist } from '../constants/responseMessages';

const checkPostAndJob = async (req, res, next) => {
  const { postSlug: slug } = req.params;

  const foundPost = await Post.findOne({
    slug,
    status: { $ne: 'deleted' },
  })
    .select('-__v')
    .populate('author', '-userType -__v -password');

  if (!foundPost) {
    return res.status(statusCodes.NOT_FOUND).json({
      status: statusCodes.NOT_FOUND,
      message: notExist('Post'),
    });
  }

  req.post = foundPost;

  next();
};

export default checkPostAndJob;
