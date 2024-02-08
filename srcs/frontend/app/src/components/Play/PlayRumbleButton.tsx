import { useContext } from "react";
import SocketWrapper, {
	SocketWrapperContext
} from "../../utils/websockets/SocketWrapper";
import { ClientEvents } from "../../utils/websockets/types";
import { TbBrandAppleArcade } from "react-icons/tb"

export function PlayRumbleButton() {
	const sm: SocketWrapper = useContext(SocketWrapperContext);

	function searchRumbleGame() {
		sm.emit({
			event: ClientEvents.LobbyCreate,
			data: {
				mode: "Rumble"
			}
		});
	}

	return (
		<div className="pb-6">
			<button className="w-[500px] h-[650px] bg-[#1a1a1a] hover:bg-[#323232] text-white font-bold py-2 px-4 border-2 border-amber-800" onClick={searchRumbleGame}>
			<div className="PVE-button">
					<TbBrandAppleArcade size='150'/>
					<h1>
						PLAYER VS PLAYER
					</h1>
					<h2>Rumble mode</h2>
					<div className="PVE-button-li">
						<li>Same rules as usual</li>
						<li>No mmr update, have fun :)</li>
						<li>Bonus <span style={{color: 'crimson'}}>red</span> : Ball is Faster</li>
						<li>Bonus <span style={{color: 'lightgreen'}}>green</span> : You are Wider</li>
						<li>Bonus <span style={{color: 'skyblue'}}>blue</span> : Enemy is Slowed</li>
					</div>
				</div>
  			</button>
		</div>
	);
}