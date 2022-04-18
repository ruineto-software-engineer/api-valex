import { Request, Response } from 'express';
import * as cardService from '../services/cardService.js';
import * as rechargeService from '../services/rechargeService.js';

export async function createRecharge(req: Request, res: Response) {
	const rechargeData = req.body;
	const cardIdParams = parseInt(req.params.cardId);

	cardService.checkCardId(rechargeData.cardId, cardIdParams);
	const searchedCard = await cardService.findCardById(rechargeData.cardId);
	cardService.isVirtualCard(searchedCard.isVirtual);
	cardService.expirationDateValid(searchedCard.expirationDate);

	await rechargeService.insertRecharge(rechargeData);

	res.sendStatus(201);
}
