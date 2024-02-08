function getJwtTokenFromCookie(): string | null {
	const cookies = document.cookie.split(";");
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith("JWT" + "=")) {
			const token = cookie.substring("JWT".length + 1);
			return decodeURIComponent(token);
		}
	}
	return null;
}

export default getJwtTokenFromCookie;
