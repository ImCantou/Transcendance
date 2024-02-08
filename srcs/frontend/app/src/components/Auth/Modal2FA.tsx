import { useState } from "react";
import apiAddress from "../../utils/apiAddress.ts";
import getJwtTokenFromCookie from "../../utils/getJWT.ts";
import Popup from "reactjs-popup";
import { notifyError } from "../../utils/notify.ts";
import { Modal2FAProps } from "./TModal2FA";
import { throwErrorMessage } from "../../utils/throwErrorMessage.ts";
import { useNavigate } from "react-router";
import { TwoFAOTPInput } from "../Settings/TwoFA/TwoFAOTPInput/TwoFAOTPInput.tsx";
import "./Modal2FA.styles.css";

function Modal2FA({ user }: Modal2FAProps) {
	const [OTP, setOTP] = useState("");
	const [open, setOpen] = useState(true);
	const navigate = useNavigate();

	function openModal() {
		setOpen(true);
	}

	function closeModal() {
		setOpen(false);
		setOTP("");
	}

	function verifyOTPBack() {
		const url = apiAddress + "/auth/2FA/verify";
		fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				user: user,
				OTP: OTP
			})
		})
			.then(function (response) {
				if (!response.ok) throwErrorMessage(response);
				return response.json();
			})
			.then(function (data) {
				document.cookie = `JWT=${data.access_token};Path=/`;
				navigate("/home", { replace: true });
			})
			.catch(function () {
				notifyError("Incorrect OTP");
			});
	}

	return (
		<div className="flex justify-center items-center h-screen w-screen">
			<button
				className="mx-2 px-2 py-1 rounded-md hover:bg-amber-800 text-white font-semibold border-4 bg-zinc-500"
				onClick={openModal}
			>
				Open 2FA Modal
			</button>
			<Popup
				modal
				nested
				open={open}
				onClose={closeModal}
				closeOnDocumentClick={false}
				className="my-popup"
			>
				<TwoFAOTPInput
					OTP={OTP}
					setOTP={setOTP}
					callBack={verifyOTPBack}
				/>
			</Popup>
		</div>
	);
}

export default Modal2FA;
