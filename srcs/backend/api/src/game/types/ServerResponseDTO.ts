import { LobbyMode } from "../Lobby/lobby.types";
import { Paddle } from "../Pong/types/Paddle";
import { Point } from "../Pong/types/Point";
import { PowerUpType } from "../Pong/types/PowerUp";
import { ServerEvents } from "./ServerEvents";

export type ServerResponseDTO = {
	[ServerEvents.LobbyState]: {
		lobbyId: string,
		lobbyMode: LobbyMode,
		hasStarted: boolean,
		hasFinished: boolean,
		countdown: number,
		isPaused: boolean,
		playersCount: number,
		gameWidth: number,
		gameHeight: number,
		powerUpPosition: Point | null,
		powerUpType: PowerUpType | null,
		ballPosition: Point,
		ballSpeedUp: boolean,
		padPositions: Record<string, Paddle>,
		scores: Record<string, number>,
		playerNames: Record<string, string>,
		timeleft: number,
	}

	[ServerEvents.GameMessage]: {
		message: string;
		mode: LobbyMode;
		lobbyId: string;
		player1MMR: string;
		player2MMR: string;
	}

	[ServerEvents.Pong]: {
		message: string
	}

	[ServerEvents.QueueJoined]: {

	}

	[ServerEvents.QueueLeft]: {
		
	}

	[ServerEvents.LobbyError]: {
		message: string;
	}

	[ServerEvents.PrivateJoined]: {

	}

	[ServerEvents.PrivateLeft]: {
		
	}
}