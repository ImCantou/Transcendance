import { ListChannel } from "../../layouts/ChatLayout/chat.d";
import ChannelBoard from "./ChannelBoard/ChannelBoard";
import ChannelBoardButton from "./ChannelBoard/ChannelBoardButton";

type ChatNavType = {
	creation: boolean;
	channel: ListChannel;
	community: boolean;
	current: string;
	direct: boolean;

	setDirect: any;
	setCommunity: any;
	setCreation: any;
	setChannel: any;
	setCurrent: any;
};

function ChatNav({
	creation,
	channel,
	community,
	current,
	direct,
	setDirect,
	setCreation,
	setCommunity,
	setCurrent
}: ChatNavType) {
	return (
		<div className="flex-grow flex flex-col h-full w-[20%] min-w-[18em] max-w-[18em] bg-[#1e2124]">
			<ChannelBoardButton
				direct={setDirect}
				directvalue={direct}
				creation={setCreation}
				creationvalue={creation}
				community={setCommunity}
				communityvalue={community}
			/>
			<ChannelBoard
				channels={channel}
				setCurrent={setCurrent}
				current={current}
				direct={direct}
			/>
		</div>
	);
}

export default ChatNav;
