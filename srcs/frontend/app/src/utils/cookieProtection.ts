import getJwtTokenFromCookie from "./getJWT.ts";
import { notifyError } from "./notify.ts";

export async function checkUser() {
	const url = `http://${import.meta.env.VITE_SERVER_HOSTNAME}:3000/user/me`;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: "Bearer " + getJwtTokenFromCookie()
		}
	});
	if (!response.ok) {
		notifyError("Cookie Protection : " + response.statusText);
		return false;
	}
	return true;
}

export async function cookieProtection() {
	if (!getJwtTokenFromCookie() || !(await checkUser())) {
		self.location.href = "/";
	}
}

export function getUserPathTokenFromCookie(): string | null {
	const cookies = document.cookie.split(";");
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith("userPath" + "=")) {
			const token = cookie.substring("userPath".length + 1);
			return decodeURIComponent(token);
		}
	}
	return null;
}
