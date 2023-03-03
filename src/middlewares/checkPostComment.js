import { PostComment } from '../models';
import { NOT_FOUND } from '../constants/statusCodes';
import { notExist } from '../constants/responseMessages';

const checkPostComment = async (req, res, next) => {
  const { postCommentId: _id } = req.params;

  const foundPostComment = await PostComment.findOne({
    _id,
    status: 'active',
  });

  if (!foundPostComment) {
    return res.status(NOT_FOUND).json({
      status: NOT_FOUND,
      message: notExist('Post Comment'),
    });
  }

  req.postComment = foundPostComment;

  next();
};

export default checkPostComment;
