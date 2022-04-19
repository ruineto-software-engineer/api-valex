import { NextFunction, Request, Response } from 'express';
import { stripHtml } from 'string-strip-html';
import cardSchema from '../schemas/cardSchema.js';
import cardVirtualSchema from '../schemas/cardVirtualSchema.js';
import cardActivationSchema from '../schemas/cardActivationSchema.js';
import cardManageSchema from '../schemas/cardManageSchema.js';
import paymentSchema from '../schemas/paymentSchema.js';
import paymentOnlineSchema from '../schemas/paymentOnlineSchema.js';
import rechargeSchema from '../schemas/rechargeSchema.js';

function sanitizeString(string: string) {
	return stripHtml(string).result.trim();
}

const schemas = {
	'/card': cardSchema,
	'/card/activation': cardActivationSchema,
	'/card/manage': cardManageSchema,
	'/card/virtual/create': cardVirtualSchema,
	'/card/virtual/delete': cardVirtualSchema,
	'/recharge': rechargeSchema,
	'/payment': paymentSchema,
	'/payment/online': paymentOnlineSchema
};

export default async function validateSchemaMiddleware(req: Request, res: Response, next: NextFunction) {
	const { body } = req;

	let schema;
	if (req.path.includes('activation')) {
		schema = schemas['/card/activation'];
	} else if (req.path.includes('manage')) {
		schema = schemas['/card/manage'];
	} else if (req.path.includes('online')) {
		schema = schemas['/payment/online'];
	} else if (req.path.includes('virtual') || req.path.includes('delete')) {
		if (req.path.includes('virtual')) {
			schema = schemas['/card/virtual/create'];
		} else {
			schema = schemas['/card/virtual/delete'];
		}
	} else {
		schema = schemas['/' + req.path.split('/')[1]];
	}

	Object.keys(body).forEach((key) => {
		if (typeof body[key] === 'string') body[key] = sanitizeString(body[key]);
	});

	const validation = schema.validate(body, { abortEarly: false });
	if (validation.error) return res.status(422).send(validation.error.message);

	next();
}
