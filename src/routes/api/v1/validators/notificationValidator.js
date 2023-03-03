import { Joi } from 'celebrate';

const updateNotificationToken = Joi.object().keys({
  notificationToken: Joi.string().required(),
});

export default {
  updateNotificationToken,
};
