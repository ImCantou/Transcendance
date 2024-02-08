import { NavLink } from "react-router-dom";
import { AiFillWechat } from "react-icons/ai";

export function ChatNavLink() {
	let activeClassName = "mx-4 px-2 py-2 rounded-md shrink-0";
	let normalClassName =
		"hover:bg-amber-800 mx-4 px-2 py-2 rounded-md shrink-0";

	return (
		<NavLink
			to="/chat"
			className={({ isActive }) =>
				isActive ? activeClassName : normalClassName
			}
		>
			{({ isActive }) =>
				isActive ? (
					<AiFillWechat
						className="h-11 w-11"
						color="#92400e"
						title="ChatActive"
					/>
				) : (
					<AiFillWechat className="h-11 w-11" title="ChatInactive" />
				)
			}
		</NavLink>
	);
}
