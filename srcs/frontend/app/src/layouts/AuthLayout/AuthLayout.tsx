import { useLoaderData } from "react-router";
import Modal2FA from "../../components/Auth/Modal2FA.tsx";
import { User } from "../../utils/hooks/TuseUser";

function AuthLayout() {
	const user: unknown = useLoaderData();

	if (user) {
		return <Modal2FA user={user as User} />;
	} else {
		return <h2 className="flex justify-center items-center text-white text-xl text-center font-bold">Loading</h2>;
	}
}

export default AuthLayout;
