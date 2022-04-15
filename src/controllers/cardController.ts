import { Request, Response } from 'express';
import * as employeeService from '../services/employeeService.js';
import * as cardService from '../services/cardService.js';

export async function createCard(req: Request, res: Response) {
	const { employeeId, type } = req.body;
	const employeeIdParams = parseInt(req.params.employeeId);

	const employee = await employeeService.employeeValidation(employeeId, employeeIdParams);
	const cardholderName = employeeService.generateEmployeeCardName(employee.fullName);
	const expirationDate = cardService.generateExpirationDate();
	const number = cardService.generateCardNumber();
	const securityCode = cardService.generateCardCVV();

	const newCard = {
		employeeId,
		number,
		cardholderName,
		securityCode,
		expirationDate,
		password: null,
		isVirtual: false,
		originalCardId: null,
		isBlocked: true,
		type
	};

	await cardService.searchCardByTypeAndEmployeeId(type, employeeId);
	await cardService.insertNewCard(newCard);

	res.sendStatus(201);
}

export async function activationCard(req: Request, res: Response) {
	const cardData = req.body;

	const searchedCard = await cardService.findCardById(cardData.cardId);
	cardService.expirationDateValid(searchedCard.expirationDate);
	cardService.isActivatedCard(searchedCard.password);
	cardService.isValidCVV(cardData.cvv, searchedCard.securityCode);
	const passwordHashed = cardService.cardPasswordHashed(cardData.password);

	const activatedCard = {
		...searchedCard,
		password: passwordHashed
	};

	await cardService.activeCard(cardData.cardId, activatedCard);

	res.sendStatus(200);
}

export async function balanceCard(req: Request, res: Response) {
	const cardId = parseInt(req.params.cardId);

	const searchedCard = await cardService.findCardById(cardId);
	const searchedPayments = await cardService.paymentsCard(searchedCard.id);
	const searchedRecharges = await cardService.rechargesCard(searchedCard.id);
	const balance = cardService.balanceCard(searchedPayments, searchedRecharges);

	const totalBalance = {
		balance,
		transactions: searchedPayments,
		recharges: searchedRecharges
	}

	res.status(200).send(totalBalance);
}
