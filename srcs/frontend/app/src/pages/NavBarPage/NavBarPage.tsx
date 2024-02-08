import { NavBarLayout } from "../../layouts/NavBar/NavBarLayout";
import { UserProvider } from "../../utils/contexts/userContext";
import { cookieProtection } from "../../utils/cookieProtection";

export function NavBarPage() {
	cookieProtection();
	return (
		
		<UserProvider>
			<NavBarLayout />
		</UserProvider>
	);
}
