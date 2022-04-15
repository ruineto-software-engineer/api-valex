import * as companyRepository from "../repositories/companyRepository.js";
import * as errorUtils from '../utils/errosUtils.js';

export async function validateApiKey(xApiKey: string) {
  const company = await companyRepository.findByApiKey(xApiKey);
  if(!company) throw errorUtils.notFoundError('Company');

  return company;
}