import LoginButton from "../../components/Login/LoginButton";
import "./LoginLayout.styles.css";
import { GiAngelWings } from "react-icons/gi";

function LoginLayout() {
	return (
		<div className="h-full flex flex-col items-center justify-center">
			<div className=" flex flex-row items-center justify-center my-10">
				<GiAngelWings
					className="h-28 w-28 mx-5"
					title="AngelWings"
					color="#92400e"
				/>
				<h2 className="flex text-center  text-white text-6xl font-bold py-5">
					Welcome to Transcendence
				</h2>
				<GiAngelWings
					className="h-28 w-28 mx-5"
					title="AngelWings"
					color="#92400e"
				/>
			</div>
			<LoginButton />
		</div>
	);
}

export default LoginLayout;
