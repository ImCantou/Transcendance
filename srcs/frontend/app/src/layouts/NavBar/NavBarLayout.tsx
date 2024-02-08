import { NavBar } from "../../components/NavBar/NavBar";
import { Outlet } from "react-router-dom";

export function NavBarLayout() {
	return (
		<>
			<header>
				<NavBar />
			</header>
			<Outlet />
		</>
	);
}
