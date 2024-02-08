import apiAddress from "../../../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../../../utils/getJWT";
import { notifyError, notifySuccess } from "../../../../../utils/notify";

type SaveType = {
	id: string;
	name: string;
	status: string;
	password: string;
};

function Save({ id, name, status, password }: SaveType) {
	const sendSetting = () => {
		fetch(apiAddress + "/chat/channel/settings", {
			method: "PATCH",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id: id,
				name: name,
				status: status,
				password: password
			})
		})
			.then(function (res: Response) {
				if (!res.ok) {
					throw new Error("Request failed with status " + res.status);
				}
				notifySuccess("Update successfull");
			})
			.catch(function () {
				notifyError("Settings couldn't update.");
			});
	};
	return (
		<button
			onClick={() => {
				sendSetting();
			}}
			className="w-full mx-8 mb-5 rounded-md hover:bg-amber-800 text-white text border-white text-2xl font-semibold border-4 bg-zinc-500"
		>
			SAVE
		</button>
	);
}

export default Save;
