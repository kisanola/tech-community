import { Joi } from 'celebrate';

const query = Joi.object().keys({
  offset: Joi.number(),
  limit: Joi.number(),
});

export default { query };
