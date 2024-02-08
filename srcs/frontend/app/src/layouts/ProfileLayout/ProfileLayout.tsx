import './ProfileLayout.styles.css'
import { useLoaderData } from 'react-router';
import AddFriendButton from "../../components/Profile/AddFriendButton.tsx";
import History from "../../components/Profile/History.tsx";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import BlockUserButton from '../../components/Profile/BlockUserButton.tsx';
import RemoveFriendButton from '../../components/Profile/RemoveFriendButton.tsx';
import UnblockUserButton from '../../components/Profile/UnblockUserButton.tsx';
import ProfileError from '../../components/Profile/ProfileError.tsx';

function ProfileLayout () {
	const userDataArray :any = useLoaderData();

	function isFriend () {
		for (const friend of userDataArray[0].friends) {
			if (friend.id === userDataArray[1].id)
				return (true);
		}
		return (false);
	}

	function isBlocked () {
		for (const blockedUser of userDataArray[1].blockedUsers) {
			if (blockedUser.id === userDataArray[0].id)
				return (true);
		}
		return (false);
	}
	if (userDataArray[0] !== undefined) {
		const winrate = Math.round(((userDataArray[0].gameProfile.gameWons.length) / (userDataArray[0].gameProfile.history.length)) * 100)
		return (
			<>
				<div className='profile-main'>
					<div className='profile-first-part'>			
						<div className='profile-data'>
								<img src={userDataArray[0].image}></img>
								<div className='profile-text'>
									<span className='profile-text-login'>{userDataArray[0].name}</span>
									<span className='profile-text-mmr'>MMR : {userDataArray[0].mmr}</span>
								</div>
								<div className='profile-buttons'>
									{ userDataArray[1].name !== userDataArray[0].name && !isFriend() && !isBlocked() && 
                    	    		    <AddFriendButton
										friendname={userDataArray[0].name} /> || userDataArray[1].name !== userDataArray[0].name && !isBlocked() &&
										<RemoveFriendButton
										friendname={userDataArray[0].name} />
									}
									{ userDataArray[1].name !== userDataArray[0].name && !isBlocked() && !isFriend() &&
										<BlockUserButton 
										username={userDataArray[0].name} />  || userDataArray[1].name !== userDataArray[0].name && !isFriend() &&
										<UnblockUserButton
										username={userDataArray[0].name} />
									}
								</div>
						</div>
						<div className='profile-winrate'>
							<h2>Winrate</h2>
							{ userDataArray[0].gameProfile.history.length > 0 && 
								<div style={{width: 250, height: 250}}>
									<CircularProgressbar 
										value={winrate} 
										text={`${winrate}%`}
										styles={buildStyles({									
											// Can specify path transition in more detail, or remove it entirely
											// pathTransition: 'none',
										
											// Colors
											pathColor: `rgba(144, 238, 144)`,
											textColor: winrate >= 50 ? 'rgba(144, 238, 144)' : 'rgba(240, 128, 128)',
											trailColor: 'rgba(240, 128, 128)',
											backgroundColor: '#3e98c7',
										  })} 
									/>
								</div>
							}
							<h3>Total games : {userDataArray[0].gameProfile.history.length}</h3>
						</div>
					</div>
					<div className='profile-other-part'>
						<h1>History</h1>
						<div className='profile-history'>
							<History user={userDataArray[0]}/>
						</div>
					</div>
				</div>
			</>
		);
	}
	else
		return <ProfileError />
}
export default ProfileLayout;