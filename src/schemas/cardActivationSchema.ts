import joi from 'joi';

const cardActivationSchema = joi.object({
	cardId: joi.number().required(),
	cvv: joi.string().pattern(/^[0-9]{3}$/).required(),
	password: joi.string().pattern(/^[0-9]{4}$/).required()
});

export default cardActivationSchema;
