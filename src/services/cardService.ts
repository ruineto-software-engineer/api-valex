import * as cardRepository from '../repositories/cardRepository.js';
import * as errosUtils from '../utils/errosUtils.js';
import { valid_credit_card } from '../utils/cardUtils.js';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

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

export async function findCardById(cardData) {
	const searchedCard = await cardRepository.findById(cardData.cardId);
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
