import { Joi } from 'celebrate';

const createPostComment = Joi.object().keys({
  body: Joi.string()
    .trim()
    .min(1)
    .max(1000)
    .required(),
});

const updatePostComment = Joi.object().keys({
  body: Joi.string()
    .trim()
    .min(1)
    .max(1000)
    .required(),
});

export default {
  createPostComment,
  updatePostComment,
};
