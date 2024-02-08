import { useContext } from "react";
import { UserContext } from "../../../../utils/contexts/userContext";

function TwoFAStatus() {
	const userHook = useContext(UserContext);
	if (!userHook.user) return null;
	return (
		<div className="flex pt-10">
			<h4 className="text-white text-base font-semibold py-2">
				Status :
			</h4>
			<h4 className="text-amber-800 text-base font-bold py-2">
				&nbsp;
				{userHook.user.is2FAOn ? "ON" : "OFF"}
			</h4>
		</div>
	);
}

export default TwoFAStatus;
