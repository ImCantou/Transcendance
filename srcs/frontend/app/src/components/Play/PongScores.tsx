import './PongScores.styles.css'

interface PongScoresProps {
	player1: string,
	score1: number,
	player2: string,
	score2: number,
	timer: number,
}

export function PongScores({player1, score1, player2, score2, timer}: PongScoresProps) {
	let timerMin: number = Math.floor(Math.floor(timer / 1000) / 60);
	let timerSec: number = Math.floor((timer - timerMin * 60000) / 1000);

	return(
		<div className="PongScores">
			<div className="PongScores-divleft">
				
				<div className="PongScores-subdivleft">
					<span className="PongScores-name">
						{player1}
					</span>
				</div>
				<span>
					{score1}
				</span>
			</div>
			<div className='PongScores-divtimer'>
				<span>
					{timerMin > 0 ? timerMin : 0}:{timerSec > 9 ? timerSec : "0" + timerSec}
				</span>
			</div>
			<div className="PongScores-divright">
				<span style={{display:'flex', justifySelf:'flex-start'}}>
					{score2}
				</span>
				<div className="PongScores-subdivright">
					<span className="PongScores-name">
						{player2}
					</span>
				</div>
				
			</div>
		</div>
	)
}