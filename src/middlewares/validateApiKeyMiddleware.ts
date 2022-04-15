import { NextFunction, Request, Response } from 'express';
import * as companyService from '../services/companyService.js';

export default async function validateApiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
	const xApiKey = req.headers['x-api-key'];

	const company = await companyService.validateApiKey(xApiKey.toString());

	res.locals.company = company;

	next();
}
