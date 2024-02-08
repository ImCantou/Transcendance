import { useContext } from "react";
import apiAddress from "../../utils/apiAddress";
import getJwtTokenFromCookie from "../../utils/getJWT";
import { throwErrorMessage } from "../../utils/throwErrorMessage";
import { UserContext } from "../../utils/contexts/userContext";
import Popup from "reactjs-popup";
import { notifyError } from "../../utils/notify";
import UpdateUsernameButton from "../Settings/UpdateUsernameButton/UpdateUsernameButton";
import UpdateProfilePictureButton from "../Settings/UpdateProfilePictureButton/UpdateProfilePictureButton";

export function SignUpModal() {
	const userHook = useContext(UserContext);

	function closeModal() {
		const url = apiAddress + "/user/signup";
		fetch(url, {
			method: "PATCH",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			}
		})
			.then(function (response) {
				if (!response.ok) throwErrorMessage(response);
				return response.json();
			})
			.then(function (data) {
				userHook.setUser({
					...userHook.user,
					signUp: data.signUp
				});
			})
			.catch(function (error) {
				notifyError(error.message);
			});
	}
	return (
		<Popup
			modal
			nested
			open={userHook.user.signUp}
			onClose={closeModal}
			closeOnDocumentClick={true}
			className="my-popup"
		>
			<div className="flex flex-col w-96 border-4 items-center justify-start bg-zinc-700 rounded-md">
				<h2 className="text-white text-xl font-bold py-2">
					User settings
				</h2>
				<UpdateUsernameButton />
				<UpdateProfilePictureButton />
			</div>
			<button
				className="px-2 pt-0 pb-1 absolute -top-3 -right-3 rounded-full bg-zinc-500 hover:bg-amber-800 text-xl font-bold"
				onClick={closeModal}
			>
				&times;
			</button>
		</Popup>
	);
}
