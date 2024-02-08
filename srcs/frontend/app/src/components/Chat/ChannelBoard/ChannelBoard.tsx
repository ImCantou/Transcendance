import { useState } from "react";
import { ChannelId, ListChannel } from "../../../layouts/ChatLayout/chat.d";
import RoomInput from "./RoomInput";
import ChannelList from "./ChannelList";

function searchElements(
	channels: ListChannel,
	query: string,
	direct: boolean
): ChannelId[] {
	let res: ChannelId[] = [];

	for (let key in channels) {
		let name: string = channels[key].name;
		if (
			(query == "" || name.includes(query)) &&
			direct == channels[key].direct
		)
			res.push({ id: channels[key].id, name: channels[key].name });
	}
	return res;
}

type TypeChannelBoard = {
	channels: ListChannel;
	current: string;
	setCurrent: any;
	direct: boolean;
};

export default function ChannelBoard({
	channels,
	setCurrent,
	current,
	direct
}: TypeChannelBoard) {
	const [query, setQuery] = useState("");
	const filtredItems: ChannelId[] = searchElements(channels, query, direct);

	function changeCurrent(id: string) {
		setCurrent(id);
		setQuery("");
	}

	return (
		<div className="rounded h-[calc(100%-3rem)] w-full scroll-smooth hover:scroll-auto">
			<RoomInput query={query} setQuery={setQuery} direct={direct} />
			<ChannelList
				filtredItems={filtredItems}
				changeCurrent={changeCurrent}
				current={current}
			/>
		</div>
	);
}
