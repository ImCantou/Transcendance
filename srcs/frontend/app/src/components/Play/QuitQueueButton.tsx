import { useContext } from "react";
import SocketWrapper, {
	SocketWrapperContext
} from "../../utils/websockets/SocketWrapper";
import { ClientEvents } from "../../utils/websockets/types";

export function QuitQueueButton({ show }: { show: boolean }) {
	const sm: SocketWrapper = useContext(SocketWrapperContext);

	function QuitQueue() {
		sm.emit({
			event: ClientEvents.LobbyLeave,
		});
	}

	if (!show) {
		return null;
	} else {
		return (
			<button
				className=" my-2 px-5 py-3 rounded-md hover:bg-red-800 text-white text border-white text-4xl font-semibold border-4 bg-zinc-500"
				onClick={QuitQueue}
			>
				Quit Queue
			</button>
		);
	}
}

export default QuitQueueButton;
