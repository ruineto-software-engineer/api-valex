import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as errorsUtils from '../utils/errorsUtils.js';

export async function insertRecharge(rechargeData, cardIdParams: number) {
	if (rechargeData.cardId !== cardIdParams)
		throw errorsUtils.badRequestError('rechargeData.cardId and cardIdParams must be identical!');

	await rechargeRepository.insert(rechargeData);
}
