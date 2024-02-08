import apiAddress from "../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../utils/getJWT";
import { notifyError } from "../../../utils/notify";
import { useNavigate } from "react-router";


type FightType = {
	channelId: string;
};

function FightButton({ channelId }: FightType) {
    const navigate = useNavigate();

	const FightSend = () => {
        fetch(apiAddress + "/chat/fight", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + getJwtTokenFromCookie(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: channelId})
        })
            .then(function (res: Response) {
                if (!res.ok) {
                    throw new Error("Request failed with status " + res.status);
                }
                return res.json();
            })
            .then (function (data) {
                if (data.gameId === undefined)
                    throw new Error("Error while creating private game :(")
                navigate("/play?gameId=" + data.gameId);
            })
            .catch(function (error) {
                notifyError(error.message);
            });
		};

	return (
		<button
			className="bg-[#282b30]"
			onClick={() => {
				FightSend();
			}}
		>
			<svg
				stroke="currentColor"
				fill="none"
				strokeWidth="2"
				viewBox="0 0 24 24"
				strokeLinecap="round"
				strokeLinejoin="round"
				height={32}
				width={32}
				xmlns="http://www.w3.org/2000/svg"
				className="bg-[#282b30]"
			>
				<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline>
				<line x1="13" x2="19" y1="19" y2="13"></line>
				<line x1="16" x2="20" y1="16" y2="20"></line>
				<line x1="19" x2="21" y1="21" y2="19"></line>
				<polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"></polyline>
				<line x1="5" x2="9" y1="14" y2="18"></line>
				<line x1="7" x2="4" y1="17" y2="20"></line>
				<line x1="3" x2="5" y1="19" y2="21"></line>
			</svg>
		</button>
	);
}

export default FightButton;
