import { useEffect, useState } from "react";
import apiAddress from "../../../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../../../utils/getJWT";
import { notifyError, notifySuccess } from "../../../../../utils/notify";
import Header from "./Header";
import { Ban, ChannelUser } from "../../../../../layouts/ChatLayout/chat.d";
import Profile from "./Profile";
import ActionModo from "./ActionModo";
import Unban from "./Unban";
import { Socket } from "socket.io-client";

// Images

type ModerationType = {
	id: string;
	sockets: Socket;
};

function searchElements(list: ChannelUser[], query: string): ChannelUser[] {
	let res: ChannelUser[] = [];

	for (let key in list) {
		if (query == "" || key.includes(query)) res.push(key);
	}
	return res;
}

function Moderation({ id, sockets }: ModerationType) {
	const [list, setList] = useState<ChannelUser[]>([]);
	const [banList, setBanList] = useState<Ban[]>([]);
	const [type, setType] = useState<number>(0);
	const [query, setQuery] = useState<string>("");
	const [refresh, setRefresh] = useState<boolean>(false);

	const getListUser = () => {
		fetch(apiAddress + "/chat/channel/list", {
			method: "PATCH",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ channelId: id })
		})
			.then(function (res: Response) {
				if (!res.ok) {
					throw new Error("Access denied.");
				}
				return res.json();
			})
			.then(function (res): void {
				setList(res);
			})
			.catch(function (error) {
				notifyError(error.message);
			});
	};

	const getListBan = () => {
		fetch(apiAddress + "/chat/channel/list/ban", {
			method: "PATCH",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ channelId: id })
		})
			.then(function (res: Response) {
				if (!res.ok) {
					throw new Error("Access denied.");
				}
				return res.json();
			})
			.then(function (res): void {
				setBanList(res);
			})
			.catch(function (error) {
				notifyError(error.message);
			});
	};

	useEffect(() => {
		getListUser();
		getListBan();

		sockets.on("onModo", (data: any) => {
			notifySuccess(data.content);
			getListUser();
			getListBan();
			setRefresh(!refresh);
		});

		return () => {
			sockets.off("onModo");
		};
	}, [refresh]);

	return (
		<div className="mx-auto w-full h-[80%]">
			<Header query={query} setQuery={setQuery} setType={setType} />
			<div className="w-[90%] m-auto mt-2 h-[90%] overflow-y-auto">
				<ul>
					{type == 0
						? list?.map((e) => (
								<li
									key={e.user.id}
									className="flex flex-row justify-between items-center bg-[#282b30] text-white w-full  h-18 border-2 border-white"
								>
									<Profile user={e.user} />
									<ActionModo user={e} id={id} />
								</li>
						  ))
						: banList?.map((ban) => (
								<li
									key={ban.id}
									className="flex flex-row justify-between items-center bg-[#282b30] text-white w-full  h-18 border-2 border-white"
								>
									<Profile user={ban.user} />
									<Unban banId={ban.id} channelId={id} />
								</li>
						  ))}
				</ul>
			</div>
		</div>
	);
}

export default Moderation;
