import { useNavigate } from "react-router-dom";

function ViewProfileButton ({username}: any) {
	const navigate = useNavigate();
	
	function handleClick() {
		navigate("/profile/" + username);
	}

	return (
		<button onClick={handleClick}>View Profile</button>
	)
}

export default ViewProfileButton;