import ProfileLayout from "../../layouts/ProfileLayout/ProfileLayout.tsx";
import {UserProvider} from "../../utils/contexts/userContext.tsx";
function ProfilePage() {
	return (
		<UserProvider>
			<ProfileLayout />
		</UserProvider>
	);
}

export default ProfilePage;