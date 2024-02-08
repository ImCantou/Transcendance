import apiAddress from "../../utils/apiAddress";
import getJwtTokenFromCookie from "../../utils/getJWT";
import { throwErrorMessage } from "../../utils/throwErrorMessage";
import { notifyError } from "../../utils/notify";
import { ImBlocked } from 'react-icons/im'


function BlockUserButton({username} : any) {
	function blockUser() {
		
		let url = apiAddress + "/user/block";
		fetch (url, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + getJwtTokenFromCookie(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username: username
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
				notifyError("Error while blocking user");
			});
	}
	return (
		<button className='profile-addfriend-button' onClick={blockUser}><ImBlocked size='35' color='grey'/></button>
	);
}

export default BlockUserButton;