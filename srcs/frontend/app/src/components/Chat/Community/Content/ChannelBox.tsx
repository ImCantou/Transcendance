import { ChannelPayload } from "../../../../layouts/ChatLayout/chat.d";

type ChannelBoxType = {
	channels: ChannelPayload[];
	clickedChannel: any;
};

function ChannelBox({ channels, clickedChannel }: ChannelBoxType) {
	return (
		<div className="flex flex-row flex-wrap justify-center overflow-y-scroll scrollbar-none scrollbar-thick h-full w-full">
			{channels.map((value: ChannelPayload) => (
				<button
					key={value.id}
					className="p-1 w-[195px] h-[150px] m-[10px] leading-[150px]"
					onClick={() => {
						clickedChannel(value);
					}}
				>
					{value.name}
				</button>
			))}
		</div>
	);
}

export default ChannelBox;
