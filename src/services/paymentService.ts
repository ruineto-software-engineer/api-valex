import * as cardRepository from '../repositories/cardRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as errorsUtils from '../utils/errorsUtils.js';
import bcrypt from 'bcrypt';

export function isValidPassword(password: string, searchedCardPassword: string) {
	const isPassword = bcrypt.compareSync(password, searchedCardPassword);
	if (!isPassword) throw errorsUtils.unauthorizedError('Password');
}

export function isValidCardType(searchedCardType: string, searchedBusinessType: string) {
	if (searchedCardType !== searchedBusinessType)
		throw errorsUtils.badRequestError('cardType and businessType must be identical');
}

export function isValidCardBalance(balance: number, paymentAmount: number) {
	if (balance < paymentAmount) throw errorsUtils.badRequestError('insufficient balance to make the purchase');
}

export async function createCardPayment(paymentData) {
	await paymentRepository.insert(paymentData);
}

export async function validateCardPaymentOnline(number: string, cardholderName: string, expirationDate: string) {
	const card = await cardRepository.findByCardDetails(number, cardholderName, expirationDate);
	if (!card) throw errorsUtils.notFoundError('Card (check the information provided in the payment)');

	return card;
}

export function isValidProviderInfoCard(isValidSearchedCardNumber: string, searchedCardNumber: string) {
	if (isValidSearchedCardNumber !== searchedCardNumber)
		throw errorsUtils.badRequestError('Distinct card credentials were provided');
}
