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
	if (balance < paymentAmount)
		throw errorsUtils.badRequestError('insufficient balance to make the purchase');
}

export async function createCardPayment(paymentData) {
  await paymentRepository.insert(paymentData);
}
