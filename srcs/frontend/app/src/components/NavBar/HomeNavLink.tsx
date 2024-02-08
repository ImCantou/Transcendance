import { NavLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

export function HomeNavLink() {
	let activeClassName = "px-2 py-2 rounded-md shrink-0";
	let normalClassName = "px-2 py-2 rounded-md shrink-0";

	return (
		<div className="flex">
			<NavLink
				to="/home"
				className={({ isActive }) =>
					isActive ? activeClassName : normalClassName
				}
			>
				{({ isActive }) =>
					isActive ? (
						<div className="p-0.5 w-fit h-fit rounded-md">
							<AiFillHome
								className="box-border mx-2 my-2 h-11 w-11"
								color="#92400e"
								title="HomeActive"
							/>
						</div>
					) : (
						<div className="hover:bg-amber-800 p-0.5 w-fit h-fit rounded-md">
							<AiFillHome
								className="box-border mx-2 my-2 h-11 w-11"
								title="HomeInactive"
							/>
						</div>
					)
				}
			</NavLink>
		</div>
	);
}
