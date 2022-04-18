import * as employeeRepository from '../repositories/employeeRepository.js';
import * as errorsUtils from '../utils/errorsUtils.js';

export function checkEmployeeId(employeeId: number, employeeIdParams: number) {
	if (employeeId !== employeeIdParams)
		throw errorsUtils.badRequestError('employeeIdParams and employeeId must be identical!');
}

export async function employeeValidation(employeeId: number) {
	const employee = await employeeRepository.findById(employeeId);
	if (!employee) throw errorsUtils.notFoundError('Employee');

	return employee;
}

export function generateEmployeeCardName(employeeFullName: string) {
	const employeeFullNameUpperCase = employeeFullName.toUpperCase();
	const employeeNameArr = employeeFullNameUpperCase.split(' ').filter((name) => name.length >= 3);

	let hashTable = {};
	let employeeCardNameArr = [];
	if (employeeNameArr.length % 2 === 0) {
		for (let i = 0; i < employeeNameArr.length; i++) {
			if (i === employeeNameArr.length / 2 - 1) {
				hashTable[i] = true;
			}

			if (i === employeeNameArr.length / 2) {
				hashTable[i] = true;
			}
		}
	} else {
		for (let i = 0; i < employeeNameArr.length; i++) {
			if (i === (employeeNameArr.length + 1) / 2 - 1) {
				hashTable[i] = true;
			}
		}
	}

	for (let j = 0; j < employeeNameArr.length; j++) {
		const name = employeeNameArr[j];

		if (hashTable[j]) {
			employeeCardNameArr.push(name[0]);
			continue;
		}

		employeeCardNameArr.push(name);
	}

	return employeeCardNameArr.join(' ');
}
