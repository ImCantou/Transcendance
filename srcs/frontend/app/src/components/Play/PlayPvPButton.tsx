import { useContext } from "react";
import SocketWrapper, {
	SocketWrapperContext
} from "../../utils/websockets/SocketWrapper";
import { ClientEvents } from "../../utils/websockets/types";
import { LuSwords } from "react-icons/lu";

export function PlayPvPButton() {
	const sm: SocketWrapper = useContext(SocketWrapperContext);

	function searchPvPGame() {
		sm.emit({
			event: ClientEvents.LobbyCreate,
			data: {
				mode: "PvP"
			}
		});
	}

	return (
		<div className="pb-6">
			<button className="w-[500px] h-[650px] bg-[#1a1a1a] hover:bg-[#323232] text-white font-bold py-2 px-4 border-2 border-amber-800" onClick={searchPvPGame}>
			<div className="PVE-button">
					<LuSwords size='150'/>
					<h1>
						PLAYER VS PLAYER
					</h1>
					<h2>Ranked mode</h2>
					<div className="PVE-button-li">
						<li>Game duration: 5min</li>
						<li>Score 5 goals to win</li>
						<li>Use arrow keys to move</li>
						<li>Fight others to reach the top</li>
						<li>Your MMR is updated</li>
					</div>
				</div>
  			</button>
		</div>
	);
}


 

export default PlayPvPButton;
