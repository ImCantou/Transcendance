import { ServerEvents } from "./types";

export type Point = {
	x: number;
	y: number;
}

export interface Paddle {
	pos: Point;
	readonly width: number;
	readonly height: number;
	isFrozen: Boolean;
}

export type ServerPayload = {
	[ServerEvents.LobbyState]: {
		lobbyId: string,
		lobbyMode: "PvP" | "PvE" | "Rumble",
		hasStarted: boolean,
		hasFinished: boolean,
		countdown: number,
		isPaused: boolean,
		playersCount: number,
		gameWidth: number,
		gameHeight: number,
		powerUpPosition: Point | null,
		powerUpType: "Freeze" | "Giant" | "SpeedUp" | null,
		ballPosition: Point,
		ballSpeedUp: boolean,
		padPositions: Record<string, Paddle>,
		scores: Record<string, number>,
		playerNames: Record<string, string>,
		timeleft: number,
	}

	[ServerEvents.GameMessage]: {
		message: string,
        mode: 'PvE' | 'PvP' | 'Rumble' | 'Private',
		lobbyId: string,
		player1MMR: string,
		player2MMR: string,
	}

    [ServerEvents.Pong]: {
        message: string;
    }

	[ServerEvents.QueueJoined]: {

	}

	[ServerEvents.QueueLeft]: {
		
	}

	[ServerEvents.LobbyError]: {
		message: string,
	}

	[ServerEvents.PrivateJoined]: {

	}

	[ServerEvents.PrivateLeft]: {
		
	}
}