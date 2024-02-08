import { useEffect, useState } from "react";
import Name from "./name";
import Delete from "./Delete";
import apiAddress from "../../../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../../../utils/getJWT";
import { notifyError } from "../../../../../utils/notify";
import { ChannelAllInfo } from "../../../../../layouts/ChatLayout/chat.d";
import Status from "./Status";
import Save from "./Save";

type SettingsType = {
	id: string;
};

function Settings({ id }: SettingsType) {
	const [name, setName] = useState<string>("");
	const [status, setStatus] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const InfoChannel = () => {
		fetch(apiAddress + "/chat/channel/get", {
			method: "PATCH",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ id: id })
		})
			.then(function (res: Response) {
				if (!res.ok) {
					throw new Error("Request failed with status " + res.status);
				}
				return res.json();
			})
			.then(function (e: ChannelAllInfo) {
				setName(e.name);
				setStatus(e.status.toLowerCase());
			})
			.catch(function (error) {
				notifyError(error.message);
			});
	};
	useEffect(() => {
		InfoChannel();
	}, []);

	return (
		<div className="w-full h-[calc(100%-5rem)] ">
			<div className="h-5/6 w-full">
				<Name name={name} setName={setName} />
				<Status
					setStatus={setStatus}
					status={status}
					password={password}
					setPassword={setPassword}
				/>
				<Delete id={id} />
			</div>
			<div className="bottom-0 flex flex-row w-full h-1/6">
				<button
					onClick={() => {
						InfoChannel();
					}}
					className="w-full mx-8 mb-5 rounded-md hover:bg-amber-800 text-white text border-white text-2xl font-semibold border-4 bg-zinc-500"
				>
					RESET
				</button>
				<Save id={id} name={name} status={status} password={password} />
			</div>
		</div>
	);
}

export default Settings;
