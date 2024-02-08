import { useEffect, useState } from "react";
import { User } from "./TuseUser";
import { UserHook } from "./TuseUser";
import apiAddress from "../apiAddress";
import getJwtTokenFromCookie from "../getJWT";
import { notifyError } from "../notify";
import { throwErrorMessage } from "../throwErrorMessage";

async function getUserAPI(): Promise<User> {
	const url = apiAddress + "/user/me";
	const user = fetch(url, {
		method: "GET",
		headers: {
			Authorization: "Bearer " + getJwtTokenFromCookie()
		}
	})
		.then(function (response) {
			if (!response.ok) throwErrorMessage(response);
			return response.json();
		})
		.then(function (data) {
			return data;
		})
		.catch(function (error) {
			notifyError(error.message);
		});

	return user;
}

function useUser(): UserHook {
	const [user, setUser] = useState<User>({} as User);

	useEffect(function () {
		fetchUser();
	}, []);

	async function fetchUser() {
		const user: User = await getUserAPI();
		setUser(user);
	}

	const userHook = {
		user,
		setUser
	};
	return userHook;
}

export default useUser;
