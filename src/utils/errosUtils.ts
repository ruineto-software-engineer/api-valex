export function notFoundError(entity: string) {
	return {
		type: 'error_not_found',
		message: `Could not find specified "${entity}"!`
	};
}

export function badRequestError() {
	return {
		type: 'error_bad_request',
		message: `That's an error!`
	};
}
