import * as businessRepository from '../repositories/businessRepository.js';
import * as errorsUtils from '../utils/errorsUtils.js';

export async function findBusinessById(id: number) {
  const searchedBusiness = await businessRepository.findById(id);
  if (!searchedBusiness) throw errorsUtils.notFoundError('Business');

  return searchedBusiness;
}