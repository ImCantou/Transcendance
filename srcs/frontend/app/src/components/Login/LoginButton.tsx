import api42Address from "../../utils/api42Address";
import "./LoginButton.styles.css";
import getJwtTokenFromCookie from "../../utils/getJWT.ts";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { checkUser } from "../../utils/cookieProtection.ts";

function LoginButton() {
	const navigate = useNavigate();

	function goToApi42() {
		self.location.href = api42Address;
	}

	useEffect(() => {
		async () => {
			if (getJwtTokenFromCookie() || (await checkUser())) {
				setTimeout(navigate, 500, "/home");
			}
		};
	});

	return (
		<button
			className="text-white text-xl my-10 font-bold border-white border-4 bg-zinc-700 hover:bg-amber-800 px-6 py-4 rounded-md"
			onClick={goToApi42}
		>
			<h2 className="text-6xl">LOGIN</h2>
		</button>
	);
}

export default LoginButton;
