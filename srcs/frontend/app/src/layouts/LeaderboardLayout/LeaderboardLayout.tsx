import LeaderboardFirsts from "../../components/Leaderboard/LeaderboardFirsts";
import LeaderboardOthers from "../../components/Leaderboard/LeaderboardOthers";
import "./LeaderboardLayout.styles.css"

function LeaderboardLayout() {
	return (
		<div className="leaderboard-main">
			<LeaderboardFirsts />
			<div style={{width: '100vw', textAlign: 'center', overflow: 'hidden'}}>
				<span className="leaderboard-mc">Meow t'es trop Low Bebou Nyaa~</span>
			</div>
			<LeaderboardOthers />
		</div>
	)
}

export default LeaderboardLayout;