import * as cardRepository from '../repositories/cardRepository.js';
import * as errorUtils from '../utils/errosUtils.js';
import { valid_credit_card } from '../utils/cardUtils.js';
import { faker } from '@faker-js/faker';
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
  return bcrypt.hashSync(faker.finance.creditCardCVV(), 10);
}

export async function insertNewCard(newCard) {
	await cardRepository.insert(newCard);
}

export async function searchCardByTypeAndEmployeeId(type, employeeId: number) {
	const searchedCard = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
	if(searchedCard) throw errorUtils.badRequestError();
}
