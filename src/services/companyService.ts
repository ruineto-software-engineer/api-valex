import * as companyRepository from "../repositories/companyRepository.js";
import * as errosUtils from '../utils/errosUtils.js';

export async function validateApiKey(xApiKey: string) {
  const company = await companyRepository.findByApiKey(xApiKey);
  if(!company) throw errosUtils.unauthorizedError('Company');

  return company;
}