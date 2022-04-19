import { Request, Response } from 'express';
import * as cardService from '../services/cardService.js';
import * as paymentService from '../services/paymentService.js';
import * as businessService from '../services/businessService.js';

export async function createPayment(req: Request, res: Response) {
	const paymentData = req.body;
	const cardIdParams = parseInt(req.params.cardId);

	cardService.checkCardId(paymentData.cardId, cardIdParams);

	const searchedCard = await cardService.findCardById(paymentData.cardId);
	cardService.expirationDateValid(searchedCard.expirationDate);
	cardService.isVirtualCard(searchedCard.isVirtual);
	cardService.isValidCard(searchedCard.password, searchedCard.isBlocked);
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

export async function onlinePayment(req: Request, res: Response) {
	const cardData = req.body;
	const cardIdParams = parseInt(req.params.cardId);

	cardService.checkCardId(cardData.cardId, cardIdParams);

	const isCardIdBlocked = await cardService.findCardById(cardData.cardId);
	cardService.isBlockedCard(isCardIdBlocked.isBlocked);

	const isValidSearchedCard = await cardService.findCardById(cardData.cardId);
	const searchedCard = await paymentService.validateCardPaymentOnline(
		cardData.number,
		cardData.cardholderName,
		cardData.expirationDate
	);

	paymentService.isValidProviderInfoCard(isValidSearchedCard.number, searchedCard.number);

	cardService.expirationDateValid(searchedCard.expirationDate);
	cardService.isValidCard(searchedCard.password, searchedCard.isBlocked);
	cardService.isValidCVV(cardData.securityCode, searchedCard.securityCode);

	const searchedBusiness = await businessService.findBusinessById(cardData.businessId);
	paymentService.isValidCardType(searchedCard.type, searchedBusiness.type);

	const searchedPayments = await cardService.paymentsCard(
		searchedCard.isVirtual ? searchedCard.originalCardId : searchedCard.id
	);
	const searchedRecharges = await cardService.rechargesCard(
		searchedCard.isVirtual ? searchedCard.originalCardId : searchedCard.id
	);
	const balance = cardService.balanceCard(searchedPayments, searchedRecharges);
	paymentService.isValidCardBalance(balance, cardData.amount);

	paymentService.createCardPayment({
		cardId: searchedCard.isVirtual ? searchedCard.originalCardId : searchedCard.id,
		businessId: cardData.businessId,
		amount: cardData.amount
	});

	res.sendStatus(201);
}
