import { ChannelId } from "../../../layouts/ChatLayout/chat.d";
type ChannelListType = {
	filtredItems: ChannelId[];
	changeCurrent: any;
	current: string;
};

function ChannelList({
	filtredItems,
	changeCurrent,
	current
}: ChannelListType) {
	const not_clicked: string =
		"bg-[#1e2124] hover:bg-[#23262A] hover:border-[#23262a] cursor-pointer text-2xl font-bold";
	const clicked: string = "bg-[#282b30] cursor-default text-2xl font-bold";
	const both: string =
		"w-full h-24 border-0 border-b-2 border-[#282b30] rounded-none flex items-center justify-center ";

	return (
		<div className="h-[calc(100%-5rem)] overflow-y-scroll no-scrollbar">
			<ul className="w-full flex flex-col items-center">
				{filtredItems.map((value) => (
					<li
						key={value.id}
						className={
							both + (current != value.id ? not_clicked : clicked)
						}
						onClick={() => {
							changeCurrent(value.id);
						}}
					>
						<p className="truncate">{value.name}</p>
					</li>
				))}
			</ul>
		</div>
	);
}

export default ChannelList;
