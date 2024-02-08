import { useContext } from "react";
import SocketWrapper, {
	SocketWrapperContext
} from "../../utils/websockets/SocketWrapper";
import { ClientEvents } from "../../utils/websockets/types";
import { FaRobot } from "react-icons/fa"

export function PlayVSBotButton() {
	const sm: SocketWrapper = useContext(SocketWrapperContext);

	function createPvEGame() {
		sm.emit({
			event: ClientEvents.LobbyCreate,
			data: {
				mode: "PvE"
			}
		});
	}

	return (
		<div className="pb-6">
			 <button className="w-[500px] h-[650px] bg-[#1a1a1a] hover:bg-[#323232] text-white font-bold py-2 px-4 border-2 border-amber-800 " onClick={createPvEGame}>
				<div className="PVE-button">
					<FaRobot size='150'/>
					<h1>
						PLAYER VS BOT
					</h1>
					<h2>Training mode</h2>
					<div className="PVE-button-li">
						<li>Game duration: 5min</li>
						<li>Score 5 goals to win</li>
						<li>Use arrow keys to move</li>
						<li>No MMR update go train</li>
						<li>Warning: Bot is reactive</li>
					</div>
				</div>
  			</button>
		</div>
	);
}

export default PlayVSBotButton;
