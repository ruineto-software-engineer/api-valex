import { Router } from 'express';
import * as cardController from '../controllers/cardController.js';
import validateApiKeyMiddleware from '../middlewares/validateApiKeyMiddleware.js';
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js';

const cardRouter = Router();

cardRouter.post(
	'/card/:employeeId/create',
	validateApiKeyMiddleware,
	validateSchemaMiddleware,
	cardController.createCard
);
cardRouter.put('/card/:employeeId/activation/:cardId', validateSchemaMiddleware, cardController.activationCard);
cardRouter.get('/card/:employeeId/balance/:cardId', cardController.balanceCard);

export default cardRouter;
