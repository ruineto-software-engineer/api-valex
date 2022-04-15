import { Router } from 'express';
import * as rechargeController from '../controllers/rechargeController.js';
import validateApiKeyMiddleware from '../middlewares/validateApiKeyMiddleware.js';
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js';

const rechargeRouter = Router();

rechargeRouter.post(
	'/recharge/:cardId',
	validateApiKeyMiddleware,
	validateSchemaMiddleware,
	rechargeController.createRecharge
);

export default rechargeRouter;
