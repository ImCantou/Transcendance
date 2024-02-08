import { useNavigate } from "react-router-dom";

function ButtonToLogin() {
	const navigate = useNavigate();
	function goToLogin() {
		navigate("/");
	}

	return (
		<button
			className="text-white text-xl font-bold border-white border-4 bg-zinc-700 hover:bg-amber-800 px-6 py-4 my-20 rounded-md"
			onClick={goToLogin}
		>
			Go back to Login
		</button>
	);
}

export default ButtonToLogin;
