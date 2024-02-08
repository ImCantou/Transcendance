import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../utils/contexts/userContext";
import { SettingsNavLink } from "./SettingsNavLink";

export function UserMenu() {
	const userHook = useContext(UserContext);

	return (
		<div className="flex items-center space-x-4 px-2 lg:px-3 py-2 shrink-0">
			<NavLink to={"/profile/" + userHook.user.name}  className="shrink-0 px-2 lg:px-3 ">
				<img
					className="h-12 w-12 rounded-full "
					src={userHook.user.image}
					alt="Profile Avatar"
				/>
			</NavLink>
			<div className="flex flex-col">
				<NavLink
					to={"/profile/" + userHook.user.name} 
					className="text-white text-lg font-semibold rounded-md hover:underline"
				>
					{userHook.user.name}
				</NavLink>
				<NavLink
					to="/leaderboard"
					className="text-gray-400 text-base font-semibold rounded-md hover:underline"
				>
					mmr: {userHook.user.mmr}
				</NavLink>
			</div>
			<SettingsNavLink />
		</div>
	);
}
