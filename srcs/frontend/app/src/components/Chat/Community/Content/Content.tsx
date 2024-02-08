import { useState } from "react";
import { ChannelPayload } from "../../../../layouts/ChatLayout/chat.d";
import SearchBar from "./SearchBar";
import ChannelBox from "./ChannelBox";

type ContentType = {
	channels: ChannelPayload[];
	clickedChannel: any;
};

function searchElements(
	channels: ChannelPayload[],
	query: string
): ChannelPayload[] {
	let res: ChannelPayload[] = [];

	for (let i = 0; i < channels.length; i++) {
		let name: string = channels[i].name;
		if (query == "" || name.includes(query)) res.push(channels[i]);
	}
	return res;
}

function Content({ channels, clickedChannel }: ContentType) {
	const [query, setQuery] = useState("");
	const filtredItems: ChannelPayload[] = searchElements(channels, query);

	if (channels.length == 0)
		return (
			<div className="flex flex-col items-center justify-center h-[90%]">
				<p className="text-white text-3xl">No channel</p>
			</div>
		);
	return (
		<div className="flex flex-col items-center h-[90%]">
			<SearchBar query={query} setQuery={setQuery} />
			<ChannelBox
				channels={filtredItems}
				clickedChannel={clickedChannel}
			/>
		</div>
	);
}

export default Content;
