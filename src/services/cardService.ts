import * as cardRepository from '../repositories/cardRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as reachargeRepository from '../repositories/rechargeRepository.js';
import * as errorsUtils from '../utils/errorsUtils.js';
import { valid_credit_card } from '../utils/cardUtils.js';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

export function checkCardId(cardId: number, cardIdParams: number) {
	if (cardId !== cardIdParams) throw errorsUtils.badRequestError('cardIdParams and cardId must be identical');
}

export function checkManageType(type: string) {
	if (type !== 'block' && type !== 'unlock')
		throw errorsUtils.badRequestError('the type can only be "block" or "unlock"');
}

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

	return cryptr.encrypt(cvv);
}

export async function insertNewCard(newCard) {
	await cardRepository.insert(newCard);
}

export function generateExpirationDate() {
	return dayjs().add(5, 'year').format('MM/YY');
}

export async function searchCardByTypeAndEmployeeId(type, employeeId: number) {
	const searchedCard = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
	if (searchedCard) throw errorsUtils.conflictError('Card');
}

export async function findCardById(cardId: number) {
	const searchedCard = await cardRepository.findById(cardId);
	if (!searchedCard) throw errorsUtils.notFoundError('Card');

	return searchedCard;
}

export function expirationDateValid(expirationDate: string) {
	if (dayjs().format('MM/YY') > expirationDate) throw errorsUtils.badRequestError('Expiration Date');
}

export function isValidCard(password: string, isBlocked: boolean) {
	if (!password || isBlocked) {
		if (!password) {
			throw errorsUtils.badRequestError('Card is Not Activated');
		} else {
			throw errorsUtils.badRequestError('Card is Blocked');
		}
	}
}

export function isActivatedCard(password: string) {
	if (password) throw errorsUtils.badRequestError('Card is Activated');
}

export function isNotActivatedCard(password: string) {
	if (!password) throw errorsUtils.badRequestError('Card is Not Activated');
}

export function isBlockedCard(isBlocked: boolean) {
	if (isBlocked) throw errorsUtils.badRequestError('Card is Blocked');
}

export function isNotBlockedCard(isBlocked: boolean) {
	if (!isBlocked) throw errorsUtils.badRequestError('Card is Unlocked');
}

export function isValidCVV(cvv: string, searchedCardSecurityCode: string) {
	const decryptedCVV = cryptr.decrypt(searchedCardSecurityCode);
	if (decryptedCVV !== cvv) throw errorsUtils.unauthorizedError('CVV');
}

export function isValidPassword(password: string, searchedCardPassword: string) {
	const isPassword = bcrypt.compareSync(password, searchedCardPassword);
	if (!isPassword) throw errorsUtils.unauthorizedError('Password');
}

export function cardPasswordHashed(password: string) {
	const passwordHashed = bcrypt.hashSync(password, 10);

	return passwordHashed;
}

export async function activeCard(cardId: number, activatedCard) {
	await cardRepository.update(cardId, activatedCard);
}

export async function blockCard(cardId: number, activatedCard) {
	await cardRepository.update(cardId, activatedCard);
}

export async function paymentsCard(id: number) {
	const searchedPayments = await paymentRepository.findByCardId(id);
	if (!searchedPayments) throw errorsUtils.notFoundError('Card');

	const payments = searchedPayments.map((payment) => ({
		...payment,
		timestamp: dayjs(payment.timestamp).format('DD/MM/YYYY')
	}));

	return payments;
}

export async function rechargesCard(id: number) {
	const searchedRecharges = await reachargeRepository.findByCardId(id);
	if (!searchedRecharges) throw errorsUtils.notFoundError('Card');

	const recharges = searchedRecharges.map((recharge) => ({
		...recharge,
		timestamp: dayjs(recharge.timestamp).format('DD/MM/YYYY')
	}));

	return recharges;
}

export function balanceCard(searchedPayments, searchedRecharges) {
	let totalPayments = 0;
	if (searchedPayments.length > 0) {
		searchedPayments.map((payment) => (totalPayments += payment.amount));
	}

	let totalRecharges = 0;
	if (searchedRecharges.length > 0) {
		searchedRecharges.map((recharge) => (totalRecharges += recharge.amount));
	}

	return totalRecharges - totalPayments;
}

export function isVirtualCard(isVirtual: boolean) {
	if (isVirtual) throw errorsUtils.badRequestError('Card is Virtual');
}

export function isNotVirtualCard(isVirtual: boolean) {
	if (!isVirtual) throw errorsUtils.badRequestError('Card is Not Virtual');
}

export async function deleteVirtualCard(virtualCardId: number) {
	await cardRepository.remove(virtualCardId);
}
