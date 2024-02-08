import { MessagePayload } from "../../../layouts/ChatLayout/chat.d";
import Message from "./Message";

type ConversationType = {
	messages: MessagePayload[];
	blocked: number[];
};

function Conversation({ messages, blocked }: ConversationType) {
	if (blocked === undefined) return;
	return (
		<div className="w-full h-[79%] overflow-y-scroll gap-x-2 no-scrollbar flex flex-col-reverse">
			<ul>
				{messages.map((message: MessagePayload) => (
					<li key={message.id}>
						{blocked.includes(message.authorId) ? null : (
							<Message element={message} />
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default Conversation;
