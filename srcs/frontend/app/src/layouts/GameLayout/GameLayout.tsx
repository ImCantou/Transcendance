import { PlayPvPButton } from "../../components/Play/PlayPvPButton";
import { PlayRumbleButton } from "../../components/Play/PlayRumbleButton";
import { PlayVSBotButton } from "../../components/Play/PlayVSBotButton";
import { cookieProtection } from "../../utils/cookieProtection";

function GameLayout() {
	cookieProtection();

	return (
		<>
			<div className="flex justify-around h-9/10">
				<PlayVSBotButton />
				<PlayPvPButton />	
				<PlayRumbleButton />
			</div>
		</>
	);
}

export default GameLayout;