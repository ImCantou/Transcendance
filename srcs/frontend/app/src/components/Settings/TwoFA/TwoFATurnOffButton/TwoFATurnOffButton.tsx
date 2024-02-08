import { useContext } from "react";
import apiAddress from "../../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../../utils/getJWT";
import { UserContext } from "../../../../utils/contexts/userContext";
import { notifyError, notifyInfo } from "../../../../utils/notify";
import { throwErrorMessage } from "../../../../utils/throwErrorMessage";

function TwoFATurnOffButton() {
	const userHook = useContext(UserContext);
	function turnOff2FA() {
		const url = apiAddress + "/auth/2FA/turn-off";
		fetch(url, {
			method: "PATCH",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({})
		})
			.then(function (response) {
				if (!response.ok) throwErrorMessage(response);
				return response.json();
			})
			.then(function () {
				userHook.setUser({
					...userHook.user,
					is2FAOn: false
				});
				notifyInfo("2FA has been turned off");
			})
			.catch(function (error) {
				notifyError(error.message);
			});
	}

	return (
		<div className="py-10">
			<button
				className="mx-2 px-2 py-1 rounded-md hover:bg-amber-800 text-white font-semibold border-4 bg-zinc-500"
				onClick={turnOff2FA}
			>
				{" "}
				Turn off 2FA{" "}
			</button>
		</div>
	);
}

export default TwoFATurnOffButton;
