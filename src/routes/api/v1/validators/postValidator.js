import { Joi } from 'celebrate';

const createPost = Joi.object().keys({
  image: Joi.string().trim(),
  type: Joi.string().valid('general', 'job'),
  title: Joi.string()
    .trim()
    .min(10),
  description: Joi.string()
    .trim()
    .min(50)
    .required(),
  tags: Joi.array()
    .max(5)
    .items(Joi.string().trim()),
  category: Joi.string(),
});

const updatePost = Joi.object().keys({
  image: Joi.string().trim(),
  type: Joi.string().valid('general', 'job'),
  title: Joi.string()
    .trim()
    .min(10),
  description: Joi.string()
    .trim()
    .min(50),
  tags: Joi.array()
    .max(5)
    .items(Joi.string().trim()),
  category: Joi.string(),
});

const sharePost = {
  postSlug: Joi.string().required(),
  plateforme: Joi.string().valid('facebook', 'twitter', 'mail'),
};

export default {
  createPost,
  updatePost,
  sharePost,
};
