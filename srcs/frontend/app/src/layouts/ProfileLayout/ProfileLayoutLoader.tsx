import getJwtTokenFromCookie from "../../utils/getJWT.ts";
import { notifyError } from "../../utils/notify.ts";
import apiAddress from "../../utils/apiAddress.ts";

export async function ProfileLayoutLoader({ params }: any) {
	let url = apiAddress + "/user/find?username=" + params.username;
	let dataArray = [];

	let response = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: "Bearer " + getJwtTokenFromCookie()
		}
	});
	if (!response.ok) {
		notifyError("User " + response.statusText);
		throw new Response("User " + response.statusText, {
			status: response.status
		});
	}
	let data = await response
		.json()
		.then((data) => {
			return data;
		})
		.catch(() => {});
	dataArray.push(data);

	url = apiAddress + "/user/trueMe";
	response = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: "Bearer " + getJwtTokenFromCookie()
		}
	});
	if (!response.ok) {
		throw new Response("User " + response.statusText, {
			status: response.status
		});
	}
	data = await response
		.json()
		.then((data) => {
			return data;
		})
		.catch(() => {
			notifyError("Other Error");
		});

	dataArray.push(data);
	return dataArray;
}
