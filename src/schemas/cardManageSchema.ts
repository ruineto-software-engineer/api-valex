import joi from 'joi';

const cardManageSchema = joi.object({
  cardId: joi.number().required(),
  password: joi.string().pattern(/^[0-9]{4}$/).required()
});

export default cardManageSchema;