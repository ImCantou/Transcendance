import { useEffect } from "react";
import apiAddress from "../../../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../../../utils/getJWT";
import { notifyError } from "../../../../../utils/notify";

type ModoType = {
	id: number;
	channelId: string;
	isOwner: boolean;
	isModo: boolean;
};

function Modo({ id, channelId, isOwner, isModo }: ModoType) {
	const changeModo = () => {
		fetch(apiAddress + "/chat/channel/modo/change", {
			method: "POST",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ userId: id, channelId: channelId })
		})
			.then(function (res: Response) {
				if (!res.ok) {
					throw new Error("Request failed with status " + res.status);
				}
			})
			.catch(function (error) {
				notifyError(error.message);
			});
	};

	return (
		<button
			className="bg-[#282b30]"
			onClick={() => {
				if (!isOwner) changeModo();
			}}
		>
			{isOwner ? (
				<svg
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					fill="#92400e"
					width="32px"
					height="32px"
				>
					<path d="M17.0016031,15.2440856 L17.0009052,21.2451182 C17.0009052,21.8527788 16.3161092,22.2081862 15.8192057,21.8584172 L12.0007623,19.1706254 L8.18435794,21.8583162 C7.68747081,22.2082475 7.00251516,21.8528589 7.00251516,21.2451182 L7.00069412,15.2459273 C8.37018531,16.3435035 10.1084262,17 12,17 C13.8926316,17 15.6317588,16.3427691 17.0016031,15.2440856 Z M12,2 C15.8659932,2 19,5.13400675 19,9 C19,12.8659932 15.8659932,16 12,16 C8.13400675,16 5,12.8659932 5,9 C5,5.13400675 8.13400675,2 12,2 Z" />
				</svg>
			) : (
				<svg
					fill={isModo ? "#92400e" : "#ffffff"}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 232.211 232.211"
					width="32px"
					height="32px"
				>
					<path d="M218.006,180.449l14.205-134.226L166.438,68.03L115.598,3.56L64.79,67.989L0,46.174l13.074,134.275H218.006z M75.255,103.169l40.343-51.16l40.311,51.119l41.572-13.783l-6.467,61.104H40.295L34.35,89.395L75.255,103.169z" />{" "}
					<rect width="207.825" x="11.853" y="198.651" height="30" />
				</svg>
			)}
		</button>
	);
}

export default Modo;
