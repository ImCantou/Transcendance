export function usernameProtection (username : string) {
	const regex = new RegExp('^[a-zA-Z0-9-_]{1,15}$')
	return (regex.test(username));
}

export function channelnameProtection (username : string) {
	const regex = new RegExp('^[a-zA-Z0-9-_ ]{1,30}$')
	return (regex.test(username));
}