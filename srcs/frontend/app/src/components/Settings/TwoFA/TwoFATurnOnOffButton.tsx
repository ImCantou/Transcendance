import { useContext } from "react";
import { UserContext } from "../../../utils/contexts/userContext";
import TwoFATurnOnButton from "./TwoFATurnOnButton/TwoFATurnOnButton";
import TwoFATurnOffButton from "./TwoFATurnOffButton/TwoFATurnOffButton";

export function TwoFATurnOnOffButton() {
	const userHook = useContext(UserContext);
	if (!userHook) return null;
	else if (userHook.user.is2FAOn) return <TwoFATurnOffButton />;
	else return <TwoFATurnOnButton />;
}
