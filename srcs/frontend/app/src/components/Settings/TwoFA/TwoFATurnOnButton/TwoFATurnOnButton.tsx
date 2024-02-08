import { useContext, useState } from "react";
import apiAddress from "../../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../../utils/getJWT";
import Popup from "reactjs-popup";
import "./TwoFATurnOnButton.styles.css";
import { UserContext } from "../../../../utils/contexts/userContext";
import { notifyError, notifyInfo } from "../../../../utils/notify";
import { throwErrorMessage } from "../../../../utils/throwErrorMessage";
import { TwoFAOTPInput } from "../TwoFAOTPInput/TwoFAOTPInput";

function TwoFATurnOnButton() {
	const [open, setOpen] = useState(false);
	const [OTP, setOTP] = useState("");
	const userHook = useContext(UserContext);

	function openModal() {
		setOpen(true);
	}
	function closeModal() {
		setOpen(false);
		setOTP("");
	}

	function turnOn2FA(otp: string) {
		const url = apiAddress + "/auth/2FA/turn-on";
		fetch(url, {
			method: "PATCH",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				TOTP: otp
			})
		})
			.then(function (response: Response) {
				setOTP("");
				if (!response.ok) throwErrorMessage(response);
				return response.json();
			})
			.then(function () {
				closeModal();
				userHook.setUser({
					...userHook.user,
					is2FAOn: true
				});
				notifyInfo("2FA has been turned on");
			})
			.catch(function () {
				notifyError("Incorrect OTP");
			});
	}

	return (
		<div className="py-10">
			<button
				className="mx-2 px-2 py-1 rounded-md hover:bg-amber-800 text-white font-semibold border-4 bg-zinc-500"
				onClick={openModal}
			>
				Turn on 2FA
			</button>
			<Popup
				modal
				nested
				open={open}
				onClose={closeModal}
				className="my-popup"
			>
				<div>
					<TwoFAOTPInput
						OTP={OTP}
						setOTP={setOTP}
						callBack={turnOn2FA}
					/>
					<button
						className="px-2 pt-0 pb-1 absolute -top-3 -right-3 rounded-full bg-zinc-500 hover:bg-amber-800 text-xl font-bold"
						onClick={closeModal}
					>
						&times;
					</button>
				</div>
			</Popup>
		</div>
	);
}

export default TwoFATurnOnButton;
