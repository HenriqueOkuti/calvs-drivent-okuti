import Joi from "joi";

export const createPaymentSchema = Joi.object({
  something: Joi.string().required(),
});
