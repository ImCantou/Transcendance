import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

// Type
import { ChannelPayload } from "../../../layouts/ChatLayout/chat.d";

// Dependencies
import MessageEntry from "../MessageEntry";
import Conversation from "./Conversation";
import Modo from "./Modo/Modo";

// Images
import Default from "./Default";
import Header from "./Header";
import apiAddress from "../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../utils/getJWT";
import { User } from "../../../utils/hooks/TuseUser";
import { notifyError } from "../../../utils/notify";

type CurrentChannel = {
	channel: { [key: string]: ChannelPayload };
	setChannel: any;
	current: string;
	setCurrent: any;
	sockets: Socket;
};

function DiscussionBoard({
	channel,
	setChannel,
	current,
	setCurrent,
	sockets
}: CurrentChannel) {
	const base_css: string = "w-full h-full bg-[#282b30]";
	const [modo, setModo] = useState<boolean>(false);
	const [blocked, setBlocked] = useState<number[]>([]);

	const getBlocked = () => {
		fetch(apiAddress + "/user/getBlocked", {
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
			.then(function (res: { friends: Array<User> }) {
				let copy: number[] = [];
				res.friends.map((elmt) => {
					copy.push(elmt.id);
				});
				setBlocked(copy);
			})
			.catch(function (error) {
				notifyError(error.message);
			});
	};

	useEffect(() => {
		getBlocked();
		setModo(false);
		sockets.on("onStatus", (data: any) => {
			setModo(false);
		});

		return () => {
			sockets.off("onStatus");
		};
	}, [current]);

	if (blocked === undefined) return;
	if (current == "") return <Default css={base_css} />;

	return (
		<div className={base_css}>
			<Header
				channel={channel}
				current={current}
				setChannel={setChannel}
				setCurrent={setCurrent}
				modoValue={modo}
				modo={setModo}
				sockets={sockets}
			/>
			<div className="h-[calc(100%-4.5rem)]">
				{modo ? (
					<>
						<Modo id={current} sockets={sockets} />
					</>
				) : (
					<>
						<Conversation
							messages={channel[current].message}
							blocked={blocked}
						/>
						<MessageEntry current={current} />
					</>
				)}
			</div>
		</div>
	);
}

export default DiscussionBoard;
