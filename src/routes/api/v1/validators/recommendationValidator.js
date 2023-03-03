import { Joi } from 'celebrate';

const recommend = Joi.object().keys({
    description: Joi.string().required().min(20).max(2000),
});

export default {
    recommend
};
