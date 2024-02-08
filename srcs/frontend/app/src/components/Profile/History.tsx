import { Link } from "react-router-dom";

function History ({user}: any) {

		const listHistory = user.gameProfile.history.map((game :any) => (
			<li key={game.id}>
				<div className={user.id == game.winner.user.id ? "game-component-WINNER" : "game-component-LOSER"}>
					<div>
						<span>{game.gamemode}</span>
					</div>
					<Link to={'/profile/' + game.winner.user.name}>
						<img src={game.winner.user.image} />
					</Link>
					<div>
						<span style={{color: "lightgreen"}}>{Math.max(...game.scores)} </span>
						/
						<span style={{color: "lightcoral"}}> {Math.min(...game.scores)}</span>
					</div>
					<Link to={'/profile/' + game.loser.user.name}>
						<img src={game.loser.user.image} />
					</Link>
					<div>
						<p>Time : </p>
						<span>{Math.floor(game.timerMS / 1000 / 60)}min {Math.floor(game.timerMS / 1000 % 60)}sec</span>
					</div>
				</div>
			</li>
		));

	return (
		<div>
			<ul>{listHistory}</ul>
		</div>
	)
}

export default History;