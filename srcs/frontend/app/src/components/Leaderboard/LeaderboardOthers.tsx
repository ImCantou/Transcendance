import { useEffect, useState } from "react";
import apiAddress from "../../utils/apiAddress.ts";
import getJwtTokenFromCookie from "../../utils/getJWT.ts";
import {throwErrorMessage} from "../../utils/throwErrorMessage.ts";
import {notifyError} from "../../utils/notify.ts";
import ViewProfileButton from "./ViewProfileButton.tsx";

function LeaderboardOthers () {
	const [data, setData] :any = useState(null); // Utiliser un array
	let leaderboardList = null;

	function getLeaderboardOthers () {
		let url = apiAddress + "/user/leaderboard/others";
		fetch (url, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
		})
			.then(function (response) {
				if (!response.ok)
					throwErrorMessage(response);
				return response.json();
			})
			.then(function (result) {
				setData(result);
			})
			.catch(function () {
				notifyError("Error while getting leaderboard");
			});
	}

 	useEffect (() => {
		getLeaderboardOthers();
		const interval = window.setInterval(() => {
			getLeaderboardOthers()
		}, 1000);

		return () => window.clearInterval(interval);
	}, []);

	 if (data !== null) {
		let rank = 4;
		 leaderboardList = data.leaderboard.map(
			(currentUser :any) => (
				 <li key={currentUser.id}>
					 <div className={"leaderboard-component"}>
					        <img src={currentUser.image}></img>
						    <div className="leaderboard-name">
							    <p>{currentUser.name}</p>
								<p>Rank: {rank++}</p>
						    </div>
							<div className="leaderboard-winrate">
								<p>MMR:</p>
								<p>{currentUser.mmr}</p>
							</div>
							<div>
								<ViewProfileButton username={currentUser.name} />
							</div>
					 </div>
				 </li>
		 ));
	 }

	return (
		<div className="leaderboard-default">
			<ul>{leaderboardList}</ul>
		</div>


	)
}

export default LeaderboardOthers;