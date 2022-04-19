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
cardRouter.post('/card/virtual/create/:cardId', validateSchemaMiddleware, cardController.createVirtualCard);
cardRouter.delete('/card/virtual/delete/:cardId', validateSchemaMiddleware, cardController.deleteVirtualCard);
cardRouter.put('/card/:cardId/activation', validateSchemaMiddleware, cardController.activationCard);
cardRouter.put('/card/:cardId/manage/block', validateSchemaMiddleware, cardController.manageCard);
cardRouter.put('/card/:cardId/manage/unlock', validateSchemaMiddleware, cardController.manageCard);
cardRouter.get('/card/:cardId/balance', cardController.balanceCard);
cardRouter.get('/card/:cardId', cardController.getCard);

export default cardRouter;
