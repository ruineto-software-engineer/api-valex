import * as rechargeRepository from '../repositories/rechargeRepository.js';

export async function insertRecharge(rechargeData) {
	await rechargeRepository.insert(rechargeData);
}
