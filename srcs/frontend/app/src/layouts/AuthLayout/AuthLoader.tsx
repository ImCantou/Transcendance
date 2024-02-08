import apiAddress from "../../utils/apiAddress.ts";
import { notifyError, notifyWarning } from "../../utils/notify.ts";

function paramsToJSON(iterator: IterableIterator<[string, string]>) {
	const result: Record<string, string> = {};
	for (const [key, value] of iterator) {
		result[key] = value;
	}
	return JSON.stringify(result);
}

export async function authLoader() {
	const urlParams = new URLSearchParams(window.location.search);
	const url = apiAddress + "/auth";

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: paramsToJSON(urlParams.entries())
	});
	if (!response.ok) {
		notifyError(response.statusText);
		throw new Response(response.statusText, { status: response.status});
	}
	const data = await response.json()
		.then(function (data) {
			if (data.is2FAOn === true) {
				return data;
			}
			if (data.access_token) {
				document.cookie = `JWT=${data.access_token};Path=/`;
				self.location.replace("home");
				return null;
			}
			throw new Error("Unexpected error has occured");
		})
		.catch(function (error) {
			notifyError(error.message);
			notifyWarning("42 token may be expired");
			return null;
		});

	return data;
}
