import * as cardRepository from '../repositories/cardRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as reachargeRepository from '../repositories/rechargeRepository.js';
import * as errosUtils from '../utils/errosUtils.js';
import { valid_credit_card } from '../utils/cardUtils.js';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import rechargeSchema from '../schemas/rechargeSchema.js';

export function generateCardNumber() {
	let number = faker.finance.creditCardNumber('mastercard');
	let isNumber = valid_credit_card(number);

	while (number[0].toString() === '6' || !isNumber) {
		number = faker.finance.creditCardNumber('mastercard');
		isNumber = valid_credit_card(number);

		if (number[0].toString() === '5' && isNumber) {
			break;
		}
	}

	if (number[0].toString() === '5') {
		while (!isNumber) {
			isNumber = valid_credit_card(number);
		}
	}

	return number.split('-').join('');
}

export function generateCardCVV() {
	const cvv = faker.finance.creditCardCVV();
	console.log('CVV card genereted (to test):', cvv);

	return bcrypt.hashSync(cvv, 10);
}

export async function insertNewCard(newCard) {
	await cardRepository.insert(newCard);
}

export function generateExpirationDate() {
	return dayjs().add(5, 'year').format('MM/YY');
}

export async function searchCardByTypeAndEmployeeId(type, employeeId: number) {
	const searchedCard = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
	if (searchedCard) throw errosUtils.conflictError('Card');
}

export async function findCardById(cardId: number) {
	const searchedCard = await cardRepository.findById(cardId);
	if (!searchedCard) throw errosUtils.notFoundError('Card');

	return searchedCard;
}

export function expirationDateValid(expirationDate: string) {
	if (dayjs().format('MM/YY') > expirationDate) throw errosUtils.badRequestError('Expiration Date');
}

export function isActivatedCard(password: string) {
	if (password) throw errosUtils.badRequestError('Card Activated');
}

export function isValidCVV(cvv: string, securityCode: string) {
	const isCVV = bcrypt.compareSync(cvv, securityCode);
	if (!isCVV) throw errosUtils.unauthorizedError('CVV');
}

export function cardPasswordHashed(password: string) {
	const passwordHashed = bcrypt.hashSync(password, 10);

	return passwordHashed;
}

export async function activeCard(cardId: number, activatedCard) {
	await cardRepository.update(cardId, activatedCard);
}

export async function paymentsCard(id: number) {
	const searchedPayments = await paymentRepository.findByCardId(id);
	if (!searchedPayments) throw errosUtils.notFoundError('Card');

	const payments = searchedPayments.map(payment => ({
		...payment,
		timestamp: dayjs(payment.timestamp).format('DD/MM/YYYY')
	}));

	return payments;
}

export async function rechargesCard(id: number) {
	const searchedRecharges = await reachargeRepository.findByCardId(id);
	if (!searchedRecharges) throw errosUtils.notFoundError('Card');

	const recharges = searchedRecharges.map(recharge => ({
		...recharge,
		timestamp: dayjs(recharge.timestamp).format('DD/MM/YYYY')
	}));

	return recharges;
}

export function balanceCard(searchedPayments, searchedRecharges) {
	let totalPayments = 0;
	if (searchedPayments.length > 0) {
		totalPayments = searchedPayments.map((payment) => (totalPayments += payment.amount))[0];
	}

	let totalRecharges = 0;
	if (searchedRecharges.length > 0) {
		totalRecharges = searchedRecharges.map((recharge) => (totalRecharges += recharge.amount))[0];
	}

	return totalRecharges - totalPayments;
}
