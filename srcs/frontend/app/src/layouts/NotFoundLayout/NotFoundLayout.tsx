import ButtonToLogin from "../../components/NotFound/ButtonToLogin.tsx";
import { TbError404 } from "react-icons/tb";

function NotFoundLayout() {
	return (
		<div className="h-full flex flex-col items-center justify-center">
			<TbError404
				className="h-64 w-64"
				title="Error404"
				color="#ffffff"
			/>
			<span className="text-white text-4xl font-bold px-6 py-3">
				This page does not exist
			</span>
			<ButtonToLogin />
		</div>
	);
}

export default NotFoundLayout;
