import { useEffect, useState } from "react";
import Header from "./Header";
import { Friends } from "../../../layouts/ChatLayout/chat.d";
import apiAddress from "../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../utils/getJWT";
import { notifyError } from "../../../utils/notify";
import Content from "./Content";

type CreateDirectType = {
	togglemodal: any;
};
function CreateDirect({ togglemodal }: CreateDirectType) {
	const [friends, setFriends] = useState<Friends[]>([]);

	const listFriends = () => {
		fetch(apiAddress + "/user/friends/get", {
			method: "GET",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie()
			}
		})
			.then(function (res: Response) {
				if (!res.ok) {
					throw new Error("Request failed with status " + res.status);
				}
				return res.json();
			})
			.then(function (data): void {
				setFriends(data.friends);
			})
			.catch(function (error) {
				notifyError("Could not create direct message");
			});
	};

	useEffect(() => {
		listFriends();
	}, []);

	return (
		<div className="flex flex-col bg-zinc-700 border-4 w-[440px] h-[550px] relative rounded">
			<Header />
			<Content friends={friends} togglemodal={togglemodal} />
		</div>
	);
}

export default CreateDirect;
