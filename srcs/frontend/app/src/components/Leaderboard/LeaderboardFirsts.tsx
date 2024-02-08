import { useEffect, useState } from "react";
import apiAddress from "../../utils/apiAddress.ts";
import getJwtTokenFromCookie from "../../utils/getJWT.ts";
import {throwErrorMessage} from "../../utils/throwErrorMessage.ts";
import {notifyError} from "../../utils/notify.ts";
import ViewProfileButton from "./ViewProfileButton.tsx";
import {GiTrophy} from 'react-icons/gi';

function LeaderboardFirsts () {
	const [data, setData] :any = useState(null); // Utiliser un array
	let leaderboardList = null;

	function getLeaderboardFirsts () {
		let url = apiAddress + "/user/leaderboard/firsts";
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
		getLeaderboardFirsts();
		const interval = window.setInterval(() => {
			getLeaderboardFirsts()
		}, 1000);

		return () => window.clearInterval(interval);
	}, []);

	 if (data !== null) {
		let rank = 1;
		 leaderboardList = data.leaderboard.map(
			(currentUser :any) => (
				 <li key={currentUser.id}>
					 <div className={"leaderboard-" + rank}>
							<span className="leaderboard-span">
								{ rank === 1 && <GiTrophy /> } 
								# {rank} 
							</span>
							<div>
								<img src={currentUser.image}></img>
						    	<div className="leaderboard-name">
								    <span className="leaderboard-racing">{currentUser.name}</span>
									<span>Rank: {rank++}</span>
						    	</div>
								<div className="leaderboard-winrate">
									<span>MMR:</span>
									<span>{currentUser.mmr}</span>
								</div>
								<div>
									<ViewProfileButton username={currentUser.name} />
								</div>
							</div>
					 </div>
				 </li>
		 ));
	 }

	return (
		<div>
			<ul className="leaderboard-firsts-default">{leaderboardList}</ul>
		</div>


	)
}

export default LeaderboardFirsts;