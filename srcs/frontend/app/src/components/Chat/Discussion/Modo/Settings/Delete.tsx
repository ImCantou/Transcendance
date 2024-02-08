import apiAddress from "../../../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../../../utils/getJWT";
import { notifyError } from "../../../../../utils/notify";

type DeleteType = {
	id: string;
};

function Delete({ id }: DeleteType) {
	const DeleteAction = () => {
		fetch(apiAddress + "/chat/channel/delete", {
			method: "PATCH",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ id: id })
		})
			.then(function (res: Response) {
				if (!res.ok) {
					throw new Error("Couldn't delete channel");
				}
			})
			.catch(function (error) {
				notifyError(error.message);
			});
	};

	return (
		<div className="flex flex-row items-center w-11/12 h-1/3 mx-auto">
			<button
				onClick={() => DeleteAction()}
				className="w-6/12 mx-2 px-4 py-2 rounded-md hover:bg-red-800 text-white text border-white text-xl font-semibold border-4 bg-zinc-500"
			>
				DELETE CHANNEL
			</button>
		</div>
	);
}

export default Delete;
