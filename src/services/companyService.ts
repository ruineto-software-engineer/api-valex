import * as companyRepository from "../repositories/companyRepository.js";
import * as errorsUtils from '../utils/errorsUtils.js';

export async function validateApiKey(xApiKey: string) {
  const company = await companyRepository.findByApiKey(xApiKey);
  if(!company) throw errorsUtils.unauthorizedError('x-api-key');

  return company;
}