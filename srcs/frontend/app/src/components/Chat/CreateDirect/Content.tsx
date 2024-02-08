import { Friends } from "../../../layouts/ChatLayout/chat.d";
import apiAddress from "../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../utils/getJWT";
import { notifyError } from "../../../utils/notify";

type ContentType = {
	friends: Friends[];
	togglemodal: any;
};

const createDirectMessage = (id: number) => {
	fetch(apiAddress + "/chat/channel/direct", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + getJwtTokenFromCookie(),
			"Content-type": "application/json"
		},
		body: JSON.stringify({ id: String(id) })
	})
		.then(function (res: Response) {
			if (!res.ok) {
				throw new Error("Request failed with status " + res.status);
			}
		})
		.catch(function (error) {
			notifyError(error.message);
		});
};

function Content({ friends, togglemodal }: ContentType) {
	if (friends === undefined) return <p>You have no friends</p>;
	else {
		return (
			<div className="h-[70%] w-[90%] no-scrollbar overflow-y-scroll gap-x-2 m-auto">
				{friends.length == 0 ? (
					<p className="flex justify-center items-center text-center w-full h-full text-3xl">
						No friends for direct message
					</p>
				) : (
					friends.map((friend: Friends) => (
						<div
							className="flex flex-row items-center gap-x-3 border-2 cursor-pointer"
							onClick={() => {
								createDirectMessage(friend.id);
								togglemodal();
							}}
							key={friend.id}
						>
							<img
								src={friend.image}
								className="h-12 w-12 rounded-full ml-2 m-auto cursor-pointer"
							/>
							<p className="text-3xl font-bold text-center w-full">
								{friend.name}
							</p>
						</div>
					))
				)}
			</div>
		);
	}
}

export default Content;
