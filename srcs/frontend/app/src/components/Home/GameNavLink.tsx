import { NavLink } from "react-router-dom";
import { RiPingPongFill } from "react-icons/ri";

export function GameNavLink() {
	return (
		<NavLink
			to="/play"
			className="text-white text-xl font-bold border-4 bg-zinc-700 hover:bg-amber-800 px-6 py-4 rounded-md"
		>
			<div className="flex flex-row justify-center items-center">
				<RiPingPongFill
					className="h-32 w-32 mr-4"
					title="GameNavLink"
				/>
				<h2 className="text-7xl"> PLAY </h2>
			</div>
		</NavLink>
	);
}
