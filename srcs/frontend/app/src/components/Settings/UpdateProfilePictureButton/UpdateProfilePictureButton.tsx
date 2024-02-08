import { useContext, useRef } from "react";
import { UserContext } from "../../../utils/contexts/userContext.tsx";
// import './UpdateProfilePictureButton.styles.css'
import getJwtTokenFromCookie from "../../../utils/getJWT.ts";
import { notifyError } from "../../../utils/notify.ts";
import apiAddress from "../../../utils/apiAddress.ts";
import { throwErrorMessage } from "../../../utils/throwErrorMessage.ts";

function updateProfilePictureButton() {
	const userHook = useContext(UserContext);
	if (!userHook.user) return null;
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	function sendToBack(type: string, img: string) {
		const url = apiAddress + "/user/update/image";

		fetch(url, {
			method: "PATCH",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				imageType: type,
				base64Data: img
			})
		})
			.then(function (response) {
				if (!response.ok) throwErrorMessage(response);
				return response.json();
			})
			.then(function () {
				userHook.setUser({
					...userHook.user,
					image: img
				});
			})
			.catch(function () {
				notifyError("Error while uploading new image");
			});
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let FR = new FileReader();
		if (!event.target.files) return;
		if (event.target.files?.[0] === undefined) return;
		FR.readAsDataURL(event.target.files?.[0]);
		FR.onload = () => {
			if (!event.target.files) return;
			sendToBack(event.target.files[0].type, String(FR.result));
		};
	};

	return (
		<div className="py-5">
			<h4 className="text-white text-center font-semibold text-base py-2">
				Profile Picture
			</h4>
			<div className="px-2 py-2 flex justify-center items-center">
				<img
					src={userHook.user.image}
					className="shrink-0 rounded-full border-2 h-24 w-24"
				/>
				<button
					className="mx-5 px-3 py-1 rounded-md hover:bg-amber-800 text-white font-semibold border-4 bg-zinc-500"
					type={"button"}
					onClick={handleButtonClick}
				>
					Upload your avatar
				</button>
				<input
					id="profilePictureInput"
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleChange}
					style={{ display: "none" }}
				/>
			</div>
		</div>
	);
}

export default updateProfilePictureButton;
