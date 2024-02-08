export function throwErrorMessage(response: Response) {
	throw new Error(
		`Request failed: ${response.statusText} (${response.status})`
	);
}
	