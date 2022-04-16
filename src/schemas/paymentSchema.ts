import joi from 'joi';

const paymentSchema = joi.object({
  cardId: joi.number().required(),
  password: joi.string().pattern(/^[0-9]{4}$/).required(),
  businessId: joi.number().required(),
  amount: joi.number().min(1).required() 
});

export default paymentSchema;