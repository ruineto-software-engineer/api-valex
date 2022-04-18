import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js';

const paymentRouter = Router();

paymentRouter.post('/payment/:cardId', validateSchemaMiddleware, paymentController.createPayment);
paymentRouter.post('/payment/online/:cardId', validateSchemaMiddleware, paymentController.onlinePayment);

export default paymentRouter;
