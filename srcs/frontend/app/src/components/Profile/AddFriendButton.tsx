import apiAddress from "../../utils/apiAddress";
import getJwtTokenFromCookie from "../../utils/getJWT";
import { throwErrorMessage } from "../../utils/throwErrorMessage";
import { notifyError, notifyInfo } from "../../utils/notify";
import { AiOutlineUserAdd } from 'react-icons/ai'


function AddFriendButton({friendname} : any) {
	function addFriend() {
		
		let url = apiAddress + "/user/friends/add";
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
				notifyInfo("Friend request to " + result.name + " has been sent !");
			})
			.catch(function () {
				notifyError("Error while adding friend");
			});
	}
	return (
		<button className='profile-addfriend-button' onClick={addFriend}><AiOutlineUserAdd size='35' color='lightgreen'/></button>
	);
}

export default AddFriendButton;