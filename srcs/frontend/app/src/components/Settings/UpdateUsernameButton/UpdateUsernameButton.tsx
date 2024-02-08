import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../utils/contexts/userContext.tsx";
import apiAddress from "../../../utils/apiAddress.ts";
import getJwtTokenFromCookie from "../../../utils/getJWT.ts";
import { notifyError, notifyInfo } from "../../../utils/notify.ts";
import { throwErrorMessage } from "../../../utils/throwErrorMessage.ts";
import {usernameProtection} from "../../../utils/regexUsernameProtection.ts";

function UpdateUsernameButton() {
	const userHook = useContext(UserContext);
	const [username, setUsername] = useState("");
	useEffect(
		function () {
			if (userHook.user.name) {
				setUsername(userHook.user.name);
			}
		},
		[userHook.user.name]
	);

	if (!userHook.user.name) return <div> Loading... </div>;

	const handleChange = (event: any) => {
		setUsername(event.target.value);
	};

	const handleClick = (event: any) => {
		if (event.key == "Enter" && username !== "") {
			if (!usernameProtection(username))
				notifyError("Username must be under 15 chars and alphanumeric");
			else sendToBack(username);
		}
	};

	function sendToBack(mymessage: string) {
		const url = apiAddress + "/user/update/name";
		fetch(url, {
			method: "PATCH",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name: mymessage
			})
		})
			.then(function (response) {
				if (!response.ok) throwErrorMessage(response);
				return response.json();
			})
			.then(function (data) {
				userHook.setUser({
					...userHook.user,
					name: data.name,
				});
				notifyInfo(`Your username has been changed to ${data.name}`);
			})
			.catch(function () {
				notifyError(`Username ${mymessage} is already taken or illegal`);
			});
	}

	return (
		<div className="py-5">
			<h4 className="text-white text-center font-semibold text-base py-2">
				Username
			</h4>
			<input
				className="px-2 py-1 bg-zinc-800 rounded-md w-36"
				value={username}
				onChange={handleChange}
				onKeyDown={handleClick}
			/>
		</div>
	);
}

export default UpdateUsernameButton;
