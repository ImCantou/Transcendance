import apiAddress from "../../../utils/apiAddress";
import getJwtTokenFromCookie from "../../../utils/getJWT";
import { throwErrorMessage } from "../../../utils/throwErrorMessage";
import { notifyError, notifyInfo } from "../../../utils/notify";

function DeclineFriendButton({friendname} : any) {
	function declineFriend() {

		let url = apiAddress + "/user/friends/decline";
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
				notifyInfo(result.name + "'s friend request has been declined !");
			})
			.catch(function () {
				notifyError("Error while declining friend");
			});
	}
	return (
		<button onClick={declineFriend}>❌</button>
	);
}

export default DeclineFriendButton;