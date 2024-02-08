import { ChannelUser } from "../../../../../layouts/ChatLayout/chat.d";
import Ban from "./Ban";
import Kick from "./Kick";
import Modo from "./Modo";
import Mute from "./Mute";

type ActionModoType = {
	id: string;
	user: ChannelUser;
};

function ActionModo({ id, user }: ActionModoType) {
	return (
		<div className="flex flex-row flex-wrap rounded-none">
			<Modo
				id={user.user.id}
				channelId={id}
				isOwner={user.channel.ownerId == user.user.id}
				isModo={user.isAdmin}
			/>
			<Mute
				id={user.user.id}
				channelId={id}
				isMute={user.mute}
				muteUntil={user.muteEnd}
			/>
			<Kick id={user.user.id} channelId={id} />
			<Ban id={user.user.id} channelId={id} />
		</div>
	);
}

export default ActionModo;
