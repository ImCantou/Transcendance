import { useEffect, useState } from "react";
import apiAddress from "../../../utils/apiAddress.ts";
import getJwtTokenFromCookie from "../../../utils/getJWT.ts";
import { throwErrorMessage } from "../../../utils/throwErrorMessage.ts";
import { notifyError } from "../../../utils/notify.ts";
import DeleteFriendButton from "./DeleteFriendButton.tsx";
import { Link } from "react-router-dom";

function FriendList() {
	const [data, setData]: any = useState(null); // Utiliser un array
	let listFriend = null;

	function getFriends() {
		let url = apiAddress + "/user/friends/get";
		fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			}
		})
			.then(function (response) {
				if (!response.ok) throwErrorMessage(response);
				return response.json();
			})
			.then(function (result) {
				setData(result);
			})
			.catch(function () {
				notifyError("Error while getting friend");
			});
	}

	useEffect(() => {
		getFriends();
		const interval = window.setInterval(() => {
			getFriends();
		}, 1000);

		return () => window.clearInterval(interval);
	}, []);

	if (data !== null) {
		listFriend = data.friends.map((friend: any) => (
			<li key={friend.id}>
				<div className="friends-friendlist-component">
						<Link
							to={"/profile/" + friend.name}
							className="shrink-0"
						>
							<img
								className={
									"friends-friendlist-img-" + friend.status
								}
								src={friend.image}
							></img>
						</Link>
					<div className="friends-friendlist-name">
						<p>{friend.name}</p>
						<span
							className={
								"friends-friendlist-nameStatus-" + friend.status
							}
						>
							{friend.status == "INGAME"
								? "IN GAME"
								: friend.status}
						</span>
					</div>
					<DeleteFriendButton friendname={friend.name} />
				</div>
			</li>
		));
	}

	return (
		<div className="social-list">
			<ul>{listFriend}</ul>
		</div>
	);
}

export default FriendList;
