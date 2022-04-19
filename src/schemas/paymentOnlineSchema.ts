import joi from 'joi';

const paymentOnlineSchema = joi.object({
	cardId: joi.number().required(),
	number: joi.string().pattern(/^[0-9]{16}$/).required(),
	cardholderName: joi.string().required(),
	securityCode: joi.string().pattern(/^[0-9]{3}$/).required(),
	expirationDate: joi.string().pattern(/^[0-9]{2}\/[0-9]{2}$/).required(),
	businessId: joi.number().required(),
	amount: joi.number().min(1).required()
});

export default paymentOnlineSchema;
