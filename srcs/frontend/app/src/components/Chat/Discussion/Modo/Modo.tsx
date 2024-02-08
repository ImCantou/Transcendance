import { useEffect, useState } from "react";
import ButtonHeader from "./ButtonHeader";
import Settings from "./Settings/Settings";
import Moderation from "./Moderation/Moderation";
import apiAddress from "../../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../../utils/getJWT";
import { notifyError } from "../../../../utils/notify";
import { Socket } from "socket.io-client";

type ModoType = {
	id: string;
	sockets: Socket;
};

function Modo({ id, sockets }: ModoType) {
	const [vue, setVue] = useState<boolean>(false);
	const [isOwner, setOwner] = useState<boolean>(false);
	const [isModo, setModo] = useState<boolean>(false);

	const getInfo = () => {
		fetch(apiAddress + "/chat/channel/owner", {
			method: "POST",
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
			.then(function (e: boolean) {
				setOwner(e);
			})
			.catch(function (error) {
				notifyError(error.message);
			});
		fetch(apiAddress + "/chat/channel/modo", {
			method: "POST",
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
			.then(function (e) {
				setModo(e);
			})
			.catch(function (error) {
				notifyError(error.message);
			});
	};

	useEffect(() => {
		getInfo();
	}, []);

	if (isOwner) {
		return (
			<div className="w-full h-[calc(100%-4rem)]">
				<ButtonHeader vue={vue} setVue={setVue} />
				{vue ? (
					<Moderation id={id} sockets={sockets} />
				) : (
					<Settings id={id} />
				)}
			</div>
		);
	} else if (isModo) {
		return (
			<div className="w-full h-[calc(100%-4rem)]">
				<Moderation id={id} sockets={sockets} />
			</div>
		);
	} else
		return (
			<div className="w-full h-[calc(100%-4rem)] m-auto text-xl">
				You are not a modo
			</div>
		);
}
export default Modo;
