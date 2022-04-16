import { Request, Response } from 'express';
import * as cardService from '../services/cardService.js';
import * as paymentService from '../services/paymentService.js';
import * as businessService from '../services/businessService.js';

export async function createPayment(req: Request, res: Response) {
	const paymentData = req.body;

	const searchedCard = await cardService.findCardById(paymentData.cardId);
	cardService.expirationDateValid(searchedCard.expirationDate);
	cardService.isNotActivatedCard(searchedCard.password);
	paymentService.isValidPassword(paymentData.password, searchedCard.password);

	const searchedBusiness = await businessService.findBusinessById(paymentData.businessId);
	paymentService.isValidCardType(searchedCard.type, searchedBusiness.type);

	const searchedPayments = await cardService.paymentsCard(searchedCard.id);
	const searchedRecharges = await cardService.rechargesCard(searchedCard.id);
	const balance = cardService.balanceCard(searchedPayments, searchedRecharges);
	paymentService.isValidCardBalance(balance, paymentData.amount);

	paymentService.createCardPayment(paymentData);

	res.sendStatus(201);
}
