import { Router } from 'express';
import * as cardController from '../controllers/cardController.js';
import validateApiKeyMiddleware from '../middlewares/validateApiKeyMiddleware.js';
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js';

const cardRouter = Router();

cardRouter.post(
	'/card/create/:employeeId',
	validateApiKeyMiddleware,
	validateSchemaMiddleware,
	cardController.createCard
);
cardRouter.put('/card/:cardId/activation', validateSchemaMiddleware, cardController.activationCard);
cardRouter.put('/card/:cardId/block', validateSchemaMiddleware, cardController.blockCard);
cardRouter.get('/card/:cardId/balance', cardController.balanceCard);
cardRouter.get('/card/:cardId', cardController.getCard);

export default cardRouter;
