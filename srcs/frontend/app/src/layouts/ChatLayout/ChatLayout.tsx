import { useContext, useEffect, useState } from "react";
import {
	WebsocketContext,
	WebsocketProvider,
	socket
} from "../../utils/contexts/WebsocketContext";
import { ChannelPayload, ListChannel, MessagePayload } from "./chat.d";

// Components
import DiscussionBoard from "../../components/Chat/Discussion/DiscussionBoard";
import apiAddress from "../../utils/apiAddress";
import getJwtTokenFromCookie from "../../utils/getJWT";
import { notifyError } from "../../utils/notify";

import ChatNav from "../../components/Chat/ChatNav";
import OverlayPopup from "../../components/Chat/OverlayPopup";

function ChatLayout() {
	// Info on room
	const [current, setCurrent] = useState<string>("");
	const [channel, setChannel] = useState<ListChannel>({});
	const [init, setInit] = useState<boolean>(false);

	const [creation, setCreation] = useState<boolean>(false);
	const [community, setCommunity] = useState<boolean>(false);
	const [direct, setDirect] = useState<boolean>(false);

	const [refresh, setRefresh] = useState<boolean>(false);

	const sockets = useContext(WebsocketContext);

	const getChatData = () => {
		// Get all the data for the variable channel
		fetch(apiAddress + "/chat/getData", {
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
				setChannel(data);
			})
			.catch(function () {
				notifyError(
					"Couldn't get the data at the creation of the chat."
				);
			});
	};

	const addMessage = (message: MessagePayload) => {
		setChannel((prev) => {
			if (prev[message.channelId] != undefined || message != null)
				prev[message.channelId].message.push(message);
			return prev;
		});
	};

	useEffect(() => {
		if (!init) {
			getChatData();
			setInit(true);
		}

		// Create new channel
		sockets.on("onChannel", (data: any) => {
			if (channel[data.id] == undefined) {
				setChannel((prev) => {
					prev[data.id] = data;
					return prev;
				});
				setCurrent(data.id);
				setRefresh(!refresh);
			}
		});

		sockets.on("onMessage", (data: MessagePayload) => {
			addMessage(data);
			setRefresh(!refresh);
		});

		sockets.on("onUpdate", (data: any) => {
			if (data.status.match("delete")) {
				if (current == "" || current.match(data.id)) {
					setCurrent("");
				}
				setChannel((prev) => {
					delete prev[data.id];
					return prev;
				});
			} else if (data.status.match("channel")) {
				setChannel((prev) => {
					prev[data.id].name = data.name;
					return prev;
				});
			}
			setRefresh(!refresh);
		});

		return () => {
			sockets.off("onMessage");
			sockets.off("onChannel");
			sockets.off("onUpdate");
		};
	}, [refresh, current]);

	return (
		<WebsocketProvider value={socket}>
			<div className="h-[calc(100%-5rem)] w-auto flex flex-grow justify-center">
				<OverlayPopup
					setCurrent={setCurrent}
					creation={creation}
					togglecreation={() => setCreation(!creation)}
					community={community}
					togglecommunity={() => setCommunity(!community)}
					channel={channel}
					setChannel={(e: ChannelPayload) =>
						setChannel({ ...channel, [e.id]: e })
					}
					direct={direct}
				/>
				<ChatNav
					creation={creation}
					community={community}
					channel={channel}
					current={current}
					direct={direct}
					setDirect={setDirect}
					setCreation={setCreation}
					setChannel={setChannel}
					setCurrent={setCurrent}
					setCommunity={setCommunity}
				/>
				<DiscussionBoard
					channel={channel}
					setChannel={(e: ListChannel) => setChannel(e)}
					current={current}
					setCurrent={setCurrent}
					sockets={sockets}
				/>
			</div>
		</WebsocketProvider>
	);
}

export default ChatLayout;
