const Joi = require('joi');

const transactionSchema = Joi.object({
  from_account_id: Joi.number().required(),
  to_account_id: Joi.number(),
  amount: Joi.number().required(),
  transaction_type: Joi.string().required(),
  branch_id: Joi.number().required(),
});

module.exports = {
  transactionSchema,
};
