import "./SocialLayout.styles.css"
import FriendList from "../../components/Social/Friends/FriendsList";
import PendingFriendList from "../../components/Social/Friends/PendingFriendsList";
import BlockList from "../../components/Social/Friends/BlockList";

function SocialLayout () {

	return (
	<div className="friends-main">
		<div className="friends-friends">
			<div className="friends-friendlist">
				<span>Friend column</span>
				<FriendList />
			</div>
			<div className="friends-friendlist">
				<span>Blocked Users Column</span>
				<BlockList />
			</div>
		</div>
		<div className="friends-friends-demand">
			<div style={{width: 425, display:'flex', flexDirection: 'column', alignItems:'center'}}>
				<span>Friends demand column</span>
				<PendingFriendList />
			</div>
		</div>
	</div>
	)
}

export default SocialLayout;