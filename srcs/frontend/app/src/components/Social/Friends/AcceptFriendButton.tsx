import apiAddress from "../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../utils/getJWT";
import { throwErrorMessage } from "../../../utils/throwErrorMessage";
import { notifyError, notifyInfo } from "../../../utils/notify";

function AcceptFriendButton({friendname} : any) {
	function acceptFriend() {

		let url = apiAddress + "/user/friends/accept";
		fetch (url, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username: friendname
			})
		})
			.then(function (response) {
				if (!response.ok)
					throwErrorMessage(response);
				return response.json();
			})
			.then(function (result) {
				notifyInfo(result.name + "'s friend request has been accepted !");
			})
			.catch(function () {
				notifyError("Error while adding friend");
			});
	}
	return (
		<button onClick={acceptFriend}>✔️</button>
	);
}

export default AcceptFriendButton;