import { useContext, useEffect, useRef, useState } from "react";
import {
	ClientEvents,
	Listener,
	ServerEvents
} from "../../utils/websockets/types";
import { ServerPayload } from "../../utils/websockets/ServerPayload";
import SocketWrapper, {
	SocketWrapperContext
} from "../../utils/websockets/SocketWrapper";
import { Point, Paddle } from "../../utils/websockets/ServerPayload";
import { PongScores } from "./PongScores";
import useUser from "../../utils/hooks/useUser";
import { UserHook } from "../../utils/hooks/TuseUser";

class GameInfo {
	lobbyId: string = "";
	lobbyMode: "PvP" | "PvE" | "Rumble" | undefined = undefined;
	countdown: number = 0;
	hasStarted: boolean = false;
	hasFinished: boolean = false;
	isPaused: boolean = false;
	playersCount: number = 0;
	gameWidth: number = 800;
	gameHeight: number = 800;
	powerUpPosition: Point | null = null;
	powerUpType: "Freeze" | "Giant" | "SpeedUp" | null = null;
	ballPosition: Point = { x: 400, y: 400 };
	ballSpeedUp: boolean = false;
	myPad: Paddle | undefined = {pos: { x: 40, y: 350 }, height: 100, width: 4, isFrozen: false};
	OpponentPad: Paddle | undefined = {pos: { x: 756, y: 350 }, height: 100, width: 4, isFrozen: false};
	myScore: number | undefined = 0;
	OpponentScore: number | undefined = 0;
	opponentName: string = "";
	timer: number = 0;
}

function Pong() {
	const sm: SocketWrapper = useContext(SocketWrapperContext);
	const userData: UserHook = useUser();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [GameState] = useState<GameInfo>(new GameInfo());
	const [MyScoreState, setMyScoreState] = useState(0);
	const [OppScoreState, setOppScoreState] = useState(0);
	const [TimerState, setTimerState] = useState(0);
	const clientId: string | null = sm.getSocketId();
	let keyPressed: Array<Boolean> = new Array<Boolean>(false, false);
	const [sideState, setsideState] = useState(false);

	function readServerPayload(data: ServerPayload[ServerEvents.LobbyState]) {
		if (GameState) {
			GameState.lobbyId = data.lobbyId;
			GameState.ballPosition = data.ballPosition;
			GameState.gameHeight = data.gameHeight;
			GameState.gameWidth = data.gameWidth;
			GameState.hasFinished = data.hasFinished;
			GameState.countdown = data.countdown;
			GameState.isPaused = data.isPaused;
			GameState.hasStarted = data.hasStarted;
			GameState.playersCount = data.playersCount;
			GameState.lobbyMode = data.lobbyMode;
			GameState.powerUpPosition = data.powerUpPosition;
			GameState.powerUpType = data.powerUpType;
			GameState.ballSpeedUp = data.ballSpeedUp;
			setTimerState(data.timeleft);

			for (let [Id, value] of Object.entries(data.scores)) {
				if (Id === clientId) {
					GameState.myScore = value;
					setMyScoreState(value);
				} else {
					GameState.OpponentScore = value;
					setOppScoreState(value);
				}
			}

			for (let [Id, value] of Object.entries(data.playerNames)) {
				if (Id !== clientId)
					GameState.opponentName = value;
			}

			for (let [Id, value] of Object.entries(data.padPositions)) {
				if (Id === clientId) {
					GameState.myPad = value;
				} else {
					GameState.OpponentPad = value;
				}
			}
			if (GameState.myPad && GameState.myPad.pos.x < data.gameWidth / 2)
				setsideState(false);
			else
				setsideState(true);
		}
	}

	function draw() {
		if (canvasRef.current) {
			// get new drawing context
			const renderCtx: CanvasRenderingContext2D | null =
				canvasRef.current.getContext("2d");

			function drawPaddles(ctx: CanvasRenderingContext2D) {
				if (GameState.OpponentPad && GameState.myPad) {
					ctx.fillStyle = (GameState.OpponentPad.isFrozen) ? "lightblue" : "white";
					ctx.fillRect(
						GameState.OpponentPad.pos.x,
						GameState.OpponentPad.pos.y,
						4,
						GameState.OpponentPad.height
					);
					ctx.fillStyle = (GameState.myPad.isFrozen) ? "lightblue" : "white";
					ctx.fillRect(GameState.myPad.pos.x, GameState.myPad.pos.y, 4, GameState.myPad.height);
				}
			}

			function drawNet(ctx: CanvasRenderingContext2D) {
				ctx.fillStyle = "#404040";
				for (let i: number = 0; i < 33; i++) {
					if (i % 2)
						ctx.fillRect(
							800 / 2 - 3,
							i * 800 * 0.03,
							6,
							800 * 0.03
						);
				}
			}

			function drawBall(ctx: CanvasRenderingContext2D) {
				ctx.fillStyle = (GameState.ballSpeedUp) ? "crimson" : "white";
				ctx.beginPath();
				ctx.arc(
					GameState.ballPosition.x,
					GameState.ballPosition.y,
					7,
					0,
					2 * Math.PI
				);
				ctx.fill();
				ctx.closePath();
			}

			function drawPowerUp(ctx: CanvasRenderingContext2D) {
				if (GameState.lobbyMode == "Rumble" && GameState.powerUpPosition)
				{
					ctx.fillStyle = (GameState.powerUpType == "Freeze") ? "skyblue" : (GameState.powerUpType == "Giant") ? "lightgreen" : "crimson";
					ctx.beginPath();
					ctx.arc(
						GameState.powerUpPosition.x,
						GameState.powerUpPosition.y,
						60,
						0,
						2 * Math.PI
					);
					ctx.fill();
					ctx.closePath();
				}
			}

			function drawCountdown(ctx: CanvasRenderingContext2D) {
				if (GameState.countdown != 0) {
					ctx.beginPath();
					ctx.font = 'bold 60px serif'
					ctx.textAlign = 'center'
					ctx.textBaseline = 'middle'
					if (GameState.countdown > 3000) {
						ctx.fillStyle = 'white'
						ctx.fillText('GOAL !', 400, 200);
					}
					else if (GameState.countdown < -3000) {
						ctx.fillStyle = 'red'
						ctx.fillText('waiting', 400, 200);
					}
					else if (GameState.countdown > 2000) {
						ctx.fillStyle = 'red'
						ctx.fillText('3', 400, 200);
					}
					else if (GameState.countdown > 1000) {
						ctx.fillStyle = 'orange'
						ctx.fillText('2', 400, 200);
					}
					else {
						ctx.fillStyle = 'yellow'
						ctx.fillText('1', 400, 200);
					}
					ctx.stroke();
				}
			}

			if (renderCtx) {
				renderCtx.fillStyle = "#000000";
				renderCtx.fillRect(0, 0, 800, 800);
				drawPaddles(renderCtx);
				drawNet(renderCtx);
				drawPowerUp(renderCtx);
				drawCountdown(renderCtx);
				drawBall(renderCtx);
			}
		}
	}

	useEffect(() => {
		function onMove(keyEvent: string) {
			if (GameState && GameState.myPad)
				sm.emit({
					event: ClientEvents.MovePaddle,
					data: {
						clientId: sm.getSocketId(),
						keyPressed: keyEvent
					}
				});
		}

		function keyPressHandler(e: KeyboardEvent) {
			if (e.key === "Up" || e.key === "ArrowUp") {
				if (GameState && GameState.myPad && !keyPressed[0])
				{
					keyPressed[0] = true;
					onMove("UpPress");
				}
				e.preventDefault();
			}
			if (e.key === "Down" || e.key === "ArrowDown") {
				if (GameState && GameState.myPad && !keyPressed[1])
				{
					keyPressed[1] = true;
					onMove("DownPress");
				}
				e.preventDefault();
			}
		}

		function keyReleaseHandler(e: KeyboardEvent) {
			if (e.key === "Up" || e.key === "ArrowUp") {
				if (GameState && GameState.myPad && keyPressed[0])
				{
					keyPressed[0] = false;
					onMove("UpRelease");
				}
				e.preventDefault();
			}
			if (e.key === "Down" || e.key === "ArrowDown") {
				if (GameState && GameState.myPad && keyPressed[1])
				{
					keyPressed[1] = false;
					onMove("DownRelease");
				}
				e.preventDefault();
			}
		}

		const onLobbyState: Listener<ServerPayload[ServerEvents.LobbyState]> = (
			data: ServerPayload[ServerEvents.LobbyState]
		) => {
			// const iter = data.padPositions.entries();

			// console.log(iter.next().value);
			// console.log(iter.next().value);
			//console.log(data.padPositions[sm.getSocketId()]);
			readServerPayload(data);
			draw();
		};

		sm.addListener(ServerEvents.LobbyState, onLobbyState);
		window.addEventListener("keydown", keyPressHandler, false);
		window.addEventListener("keyup", keyReleaseHandler, false);

		return () => {
			sm.emit({event: ClientEvents.LobbyLeave});
			sm.removeListener(ServerEvents.LobbyState, onLobbyState);
			window.removeEventListener("keydown", keyPressHandler);
			window.removeEventListener("keyup", keyReleaseHandler);
		};
	}, []);

	return (
		<>
			<div>
				{(sideState == false && <PongScores player1={userData.user.name} score1={MyScoreState} player2={GameState.opponentName} score2={OppScoreState} timer={TimerState}/>)
				 || <PongScores player2={userData.user.name} score2={MyScoreState} player1={GameState.opponentName} score1={OppScoreState} timer={TimerState}/>}
				<canvas ref={canvasRef} width={800} height={800} />
			</div>
		</>
	);
}

export default Pong;
