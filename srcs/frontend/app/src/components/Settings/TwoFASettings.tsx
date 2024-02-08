import TwoFAStatus from "./TwoFA/TwoFAStatusButton/TwoFAStatus";
import TwoFARegisterButton from "./TwoFA/TwoFARegisterButton/TwoFARegisterButton";
import { TwoFATurnOnOffButton } from "./TwoFA/TwoFATurnOnOffButton";

export function TwoFASettings() {
	return (
		<div className="px-5 py-5 mx-2 mb-10 flex flex-col w-96 border-4 items-center justify-start bg-zinc-700  rounded-md">
			<h2 className="text-white text-xl font-bold py-2">2FA settings</h2>
			<TwoFAStatus />
			<TwoFATurnOnOffButton />
			<TwoFARegisterButton />
		</div>
	);
}
