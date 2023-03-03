import { Joi } from 'celebrate';

const signup = Joi.object().keys({
  companyName: Joi.string()
    .trim()
    .required(),
  username: Joi.string()
    .trim()
    .min(4)
    .required(),
  email: Joi.string()
    .trim()
    .email()
    .required(),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
    .required(),
  notificationToken: Joi.string(),
});

const login = Joi.object().keys({
  username: Joi.string()
    .trim()
    .min(4)
    .required(),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
    .required(),
  notificationToken: Joi.string(),
});

const email = Joi.object().keys({
  email: Joi.string()
    .trim()
    .email()
    .required(),
});

const password = Joi.object().keys({
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
    .required(),
});

export default {
  signup,
  login,
  email,
  password,
};
