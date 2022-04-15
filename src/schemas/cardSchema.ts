import joi from 'joi';

const cardSchema = joi.object({
	employeeId: joi.number().required(),
	type: joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
});

export default cardSchema;
