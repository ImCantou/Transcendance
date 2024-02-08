import { NavLink } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";

export function SocialNavLink() {
	let activeClassName = "mx-4 px-2 py-2 rounded-md shrink-0";
	let normalClassName =
		"hover:bg-amber-800 mx-4 px-2 py-2 rounded-md shrink-0";

	return (
		<NavLink
			to="/social"
			className={({ isActive }) =>
				isActive ? activeClassName : normalClassName
			}
		>
			{({ isActive }) =>
				isActive ? (
					<FaUserFriends
						className="h-11 w-11"
						color="#92400e"
						title="HomeActive"
					/>
				) : (
					<FaUserFriends className="h-11 w-11" title="HomeInactive" />
				)
			}
		</NavLink>
	);
}
