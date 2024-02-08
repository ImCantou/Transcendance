import { NavLink } from "react-router-dom";
import { FiSettings } from "react-icons/fi";

export function SettingsNavLink() {
	let activeClassName = "px-2 lg:px-3 py-2 rounded-md shrink-0";
	let normalClassName = "hover:bg-amber-800 px-2 lg:px-3 py-2 rounded-md shrink-0";

	return (
		<NavLink
			to="/settings"
			className={({ isActive }) =>
				isActive ? activeClassName : normalClassName
			}
		>
			{({ isActive }) =>
				isActive ? (
					<FiSettings color="#9a3412" className="h-7 w-7" />
				) : (
					<FiSettings color="white" className="h-7 w-7" />
				)
			}
		</NavLink>
	);
}
