import { UserMenu } from "./UserMenu";
import { SearchUserInput } from "./SearchUserInput";
import { HomeNavLink } from "./HomeNavLink";
import { ChatNavLink } from "./ChatNavLink";
import { LeaderboardNavLink } from "./LeaderboardNavLink";
import { SocialNavLink } from "./SocialNavLink";

export function NavBar() {
	return (
		<nav className="h-20">
			<div className="max-w-full px-2">
				<div className="flex items-center justify-between h-20">
					<HomeNavLink />
					<div className="flex">
						<LeaderboardNavLink />
						<ChatNavLink />
						<SocialNavLink />
						<SearchUserInput />
					</div>
					<UserMenu />
				</div>
			</div>
		</nav>
	);
}
