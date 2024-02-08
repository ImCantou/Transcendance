import { NavLink } from "react-router-dom";
import { MessagePayload } from "../../../layouts/ChatLayout/chat.d";

type MessageType = {
	element: MessagePayload;
};

function Message({ element }: MessageType) {
	return (
		<div className="flex gap-x-1 hover:bg-[#23262A]">
			<NavLink to={"/profile/" + element.username} className="shrink-0">
				<img
					src={element.avatar}
					alt=""
					className="h-12 w-12 rounded-full mb-2 cursor-pointer"
				/>
			</NavLink>
			<div>
				<NavLink
					to={"/profile/" + element.username}
					className="shrink-0"
				>
					<p className="text-base font-bold hover:underline cursor-pointer">
						{element.username}
					</p>
				</NavLink>
				{!(
					element.link == undefined ||
					element.link == null ||
					element.link == ""
				) ? (
					<NavLink
						to={element.link}
						className=" hover:underline text-blue-400 shrink-0"
					>
						{element.content}
					</NavLink>
				) : (
					<p style={{ wordBreak: "break-word" }}>{element.content}</p>
				)}
			</div>
		</div>
	);
}

<NavLink
	to="/play"
	className="text-white text-xl font-bold border-4 bg-zinc-700 hover:bg-amber-800 px-6 py-4 rounded-md"
></NavLink>;

export default Message;
