const Joi = require('joi');

const userSchema = Joi.object({
  full_name: Joi.string().required(),
  gender: Joi.string().required(),
  address: Joi.string().required(),
  email: Joi.string().email().required(),
  date_of_birth: Joi.string().required(),
  identification_number: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  phone_number: Joi.string().required(),
});

module.exports = {
  userSchema,
};
