import { useEffect, useState } from "react";

// Components
import Password from "./Password/Password";
import Status from "./Status/Status";
import Customize from "./Customize/Customize";
import apiAddress from "../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../utils/getJWT";
import { notifyError } from "../../../utils/notify";

type CreateChannelType = {
	togglemodal: any;
	setChannel: any;
};

type JoinChannel = {
	name: string;
	status: string;
	password: string;
};

const fetchCreateChannel = (newChannel: JoinChannel, setChannel: any) => {
	fetch(apiAddress + "/chat/channel/create", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + getJwtTokenFromCookie(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify(newChannel)
	})
		.then(function (res: Response) {
			if (!res.ok) {
				throw new Error("Request failed with status " + res.status);
			}
			return res.json();
		})
		.then(function (e) {
			setChannel(e);
		})
		.catch(function (error) {
			notifyError("Could not create chat room");
		});
};

function CreateChannel({ togglemodal, setChannel }: CreateChannelType) {
	const [position, setPosition] = useState(0);

	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("PUBLIC");

	useEffect(() => {
		if (position == 3) {
			if (!password) setStatus("PROTECTED");
			if (name.length > 0) {
				fetchCreateChannel({ name, password, status }, setChannel);
				togglemodal();
			} else setPosition(2);
		}
	});

	return (
		<div
			id="create-channel"
			className="flex flex-col bg-zinc-700 border-4 w-[440px] h-[550px] relative rounded"
		>
			<button
				className="bg-[#3f3f46] absolute top-3 right-1 rounded-full hover:bg-[#92400e]"
				onClick={togglemodal}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					width="20px"
					height="20px"
				>
					<path
						d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
						fill="#ffffff"
					/>
				</svg>
			</button>
			{position == 0 ? (
				<Status setPosition={setPosition} setStatus={setStatus} />
			) : position == 1 ? (
				<Password
					setPosition={setPosition}
					setPassword={setPassword}
					password={password}
				/>
			) : position == 2 ? (
				<Customize
					setPosition={setPosition}
					previous={status == "PUBLIC" ? 1 : 0}
					result={name}
					setResult={setName}
				/>
			) : null}
		</div>
	);
}

export default CreateChannel;
