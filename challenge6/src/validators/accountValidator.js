const Joi = require('joi');

const accountSchema = Joi.object({
  account_number: Joi.string().required(),
  balance: Joi.number(),
  account_type: Joi.string().required(),
  status: Joi.string().required(),
});

module.exports = {
  accountSchema,
};
