import Header from "../Header";
import Input from "./Input";
import Bottom from "./Bottom";
import { useEffect, useState } from "react";

type PasswordType = {
	setPosition: any;
	setPassword: any;
	password: string;
};

function Password({ setPosition, setPassword, password }: PasswordType) {
	const [enter, setEnter] = useState<string>("");
	const [confirm, setConfirm] = useState<string>("");

	useEffect(() => {
		if (enter == confirm) setPassword(enter);
	}, [enter, confirm]);
	return (
		<div className="h-full w-full rounded-sm ">
			<Header
				title="Password"
				description="Put a password on your room to protect."
			/>
			<Input
				enter={enter}
				setEnter={setEnter}
				confirm={confirm}
				setConfirm={setConfirm}
			/>
			<Bottom
				setPosition={setPosition}
				password={password}
				enter={enter}
				confirm={confirm}
			/>
		</div>
	);
}

export default Password;
