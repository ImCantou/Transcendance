import { useState } from "react";
import { ChannelPayload } from "../../../../layouts/ChatLayout/chat.d";
import Title from "./Title";
import ButtonBar from "./ButtonBar";
import PasswordInput from "./PasswordInput";

type ProtectedChannelType = {
	current: ChannelPayload;
	backButton: any;
	joinButton: any;
};

function ProtectedChannel({
	current,
	joinButton,
	backButton
}: ProtectedChannelType) {
	const [password, setPassword] = useState("");

	return (
		<div className="w-full h-full flex justify-center items-center ">
			<div className="w-[97%] h-[97%] rounded">
				<Title name={current.name} />
				<PasswordInput password={password} setPassword={setPassword} />
				<ButtonBar
					backButton={backButton}
					joinButton={joinButton}
					password={password}
				/>
			</div>
		</div>
	);
}

export default ProtectedChannel;
