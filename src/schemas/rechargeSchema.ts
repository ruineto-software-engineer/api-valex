import joi from 'joi';

const rechargeSchema = joi.object({
	cardId: joi.number().required(),
	amount: joi.number().min(1).required()
});

export default rechargeSchema;
