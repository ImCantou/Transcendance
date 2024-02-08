import apiAddress from "../../utils/apiAddress";
import getJwtTokenFromCookie from "../../utils/getJWT";
import { throwErrorMessage } from "../../utils/throwErrorMessage";
import { notifyError, notifyInfo } from "../../utils/notify";
import { AiOutlineUserDelete } from 'react-icons/ai'


function RemoveFriendButton({friendname} : any) {
	function removeFriend() {
		
		let url = apiAddress + "/user/friends/delete";
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
			.then(function () {
				window.location.reload();
			})
			.catch(function () {
				notifyError("Error while deleting friend");
			});
	}
	return (
		<button className='profile-addfriend-button' onClick={removeFriend}><AiOutlineUserDelete size='35' color='crimson'/></button>
	);
}

export default RemoveFriendButton;