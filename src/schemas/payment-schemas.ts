import Joi from "joi";

export const postPaymentSchema = Joi.object({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.number().required(),
  }).required(),
});

export const getPaymentSchema = Joi.object({
  ticketId: Joi.number().required(),
});
