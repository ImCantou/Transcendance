import { Outlet } from "react-router-dom";
import "./HomeLayout.styles.css";
import { GameNavLink } from "../../components/Home/GameNavLink";
import { SignUpModal } from "../../components/Auth/SignUpModal";

function HomeLayout() {
	return (
		//Pourquoi outlet ?
		<div className="home-root">
			<Outlet />

			<div className="main-site">
				<SignUpModal />
				<GameNavLink />
			</div>
		</div>
	);
}

export default HomeLayout;
