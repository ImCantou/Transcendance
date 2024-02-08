import { useEffect, useState } from "react";
import apiAddress from "../../../utils/apiAddress.ts";
import getJwtTokenFromCookie from "../../../utils/getJWT.ts";
import { throwErrorMessage } from "../../../utils/throwErrorMessage.ts";
import { notifyError } from "../../../utils/notify.ts";
import { Link } from "react-router-dom";
import UnblockButton from "./UnblockButton.tsx";

function BlockList() {
	const [data, setData]: any = useState(null); // Utiliser un array
	let listFriend = null;

	function getBlocked() {
		let url = apiAddress + "/user/getBlocked";
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
				notifyError("Error while getting blocked");
			});
	}

	useEffect(() => {
		getBlocked();
		const interval = window.setInterval(() => {
			getBlocked();
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
							<img src={friend.image}></img>
						</Link>
					<div className="friends-friendlist-name">
						<p>{friend.name}</p>
					</div>
					<UnblockButton username={friend.name} />
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

export default BlockList;
