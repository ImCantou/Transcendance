import { Socket } from "socket.io";
import { Lobby } from "../Lobby/Lobby";
import { ServerEvents } from "../types/ServerEvents";
import { ServerResponseDTO } from "../types/ServerResponseDTO";
import { Ball } from "./types/Ball";
import { Paddle } from "./types/Paddle";
import { Point } from "./types/Point";
import { MovePaddleDTO } from "./MovePaddleDTO";
import { Interval } from "@nestjs/schedule";
import { Injectable } from "@nestjs/common";
import { AuthenticatedSocket } from "../types/AuthenticatedSocket";
import { PowerUp } from "./types/PowerUp";

export class Pong {
	//States
	public hasStarted: boolean = false;

	public hasFinished: boolean = false;

	public isPaused: boolean = false;

	public countdown: number = 0;

	public startTimer: number = 0;
	public endTimer: number = 300000;

	private lastUpdate: number = (new Date()).getTime();

	//Game Components Infos
	public readonly height: number = 800;
	public readonly width: number = 800;

	public readonly ball: Ball = new Ball(800, 800, 7);

	public readonly paddles: Map<AuthenticatedSocket["id"], Paddle> = new Map<AuthenticatedSocket["id"], Paddle>();

	public scores: Map<AuthenticatedSocket["id"], number> = new Map<AuthenticatedSocket["id"], number>();

	public powerUp: PowerUp;

	constructor(public readonly lobby: Lobby) {
		for (const id of this.lobby.clients.keys())
			this.scores.set(id, 0);
		if (this.lobby.gamemode == "PvE")
			this.scores.set("bot", 0);
	}

	//Methods
	public async start(): Promise<void> {
		if (this.hasStarted) return;

		this.countdown = 3000;

		this.hasStarted = true;

		for (const id of this.lobby.clients.keys()) {
			this.scores.set(id, 0);
			
			if (this.paddles.size !== 0) 
				this.paddles.set(id, new Paddle("away"));
			else 
				this.paddles.set(id, new Paddle("home"));
			
			this.lobby.setStatus(this.lobby.clients.get(id).userId, "INGAME");
			await this.lobby.refreshAuthSocket(id);
		}

		if (this.paddles.size < 2 && this.lobby.gamemode === "PvE")
		{
			this.paddles.set("bot", new Paddle("away"));
		}


		this.lobby.sendEvent<ServerResponseDTO[ServerEvents.GameMessage]>(
			ServerEvents.GameMessage,
			{
				message: "Game is Starting",
				mode: this.lobby.gamemode,
				lobbyId: this.lobby.Id,
				player1MMR: "",
				player2MMR: "",
			}
		);

		//countdown 5
		this.startTimer = (new Date().getTime());
		this.lastUpdate = (new Date().getTime());
		//gameLoop
		//send event winner + update players MMR
	}

	
	public loop(): void {
		if (this.hasStarted === false || this.hasFinished) return;
		this.nextFrame();
		this.lobby.sendLobbyState();
		if ((new Date()).getTime() - this.startTimer >= this.endTimer)
		{
			if (this.lobby.gamemode === "PvE") {
				this.endgame("");
				return ;
			}

			let id1: string = "";
			let id2: string = "";
			for (const id of this.lobby.clients.keys()) {
				if (id1 === "") {
					id1 = id;
				} else {
					id2 = id;
				}
			}
			if (this.scores.get(id1) === this.scores.get(id2))
			{
				this.endgame("");
				this.lobby.quitQueue(this.lobby.clients.get(id1).userId);
				this.lobby.quitQueue(this.lobby.clients.get(id2).userId);
			} else if (this.scores.get(id1) > this.scores.get(id2)) {
				this.endgame(id1);
			} else {
				this.endgame(id2);
			}
			return ;
		}
		
		for (const id of this.lobby.clients.keys()) {
			if (this.scores.get(id) >= 5) {
				this.endgame(id);
			}
		}
		if (this.lobby.gamemode === "PvE" && (this.scores.get("bot") >= 5)) {
				this.endgame("");
		}
	}

	private async endgame(winnerId: string): Promise<void> {
		if (winnerId !== "" && this.hasFinished === false)
		{
			this.hasFinished = true;
			for (const id of this.lobby.clients.keys()) {
				if (id != winnerId)
					await this.lobby.endInstance(this.lobby.clients.get(winnerId).userId, this.lobby.clients.get(id).userId);
			}
		}
		this.hasFinished = true;
		await this.end();
	}

	private updateball() {
		if (this.lobby.gamemode == 'Rumble') this.ball.updateSpeedUp();
		if (this.ball.speed.angle > Math.PI / 2 || this.ball.speed.angle < -Math.PI / 2)
			this.ball.checkBounce(this.paddles.values().next().value);
		else {
			const it: IterableIterator<Paddle> = this.paddles.values();
			it.next();
			this.ball.checkBounce(it.next().value);
		}

		let score: 0 | 1 | 2 | undefined = this.ball.respawn();
		if (score) {
			if (score == 2 && this.lobby.gamemode == "PvE")
				this.scores.set("bot", this.scores.get("bot") + 1);
			else {
				let arr = Array.from(this.lobby.clients.keys());
				this.scores.set(arr[score - 1], this.scores.get(arr[score - 1]) + 1);
			}
			for (let pad of this.paddles.values()){
				pad.pos.y = 350;
				pad.downKey = false;
				pad.upKey = false;
			}
			this.countdown = 5000;
		}
	}

	private getBallDestBot(botPadX: number): Point {
		let pos : Point = {x: this.ball.pos.x, y : this.ball.pos.y};

		while(pos.x < botPadX && pos.y > 0 && pos.y < this.height) {
			pos.x +=  Math.cos(this.ball.speed.angle) * this.ball.speed.length;
			pos.y +=  Math.sin(this.ball.speed.angle) * this.ball.speed.length;
		}
		if (pos.y < 0)
			pos.y = 0;
		else if (pos.y > this.height)
			pos.y = this.height;

		return ({x: 0, y: pos.y})
	}

	private updateBotPaddle() {
		if (this.lobby.gamemode === "PvE")
		{
			let pad : Paddle = this.paddles.get("bot");

			if (pad !== undefined)
			{


				if (this.ball.speed.angle > -(Math.PI /2) && this.ball.speed.angle < Math.PI / 2) {
					let dest: Point  = this.getBallDestBot(pad.pos.x);
					if (Math.abs(dest.y - (pad.pos.y + pad.height / 2)) < 10) {
						pad.pos.y = dest.y - pad.height / 2;
						pad.upKey = false;
						pad.downKey = false;
					}
					else if (dest.y < pad.pos.y + pad.height / 2) {
						pad.upKey = true;
						pad.downKey = false;
					}
					else if (dest.y > pad.pos.y + pad.height / 2) {
						pad.upKey = false;
						pad.downKey = true;
					}
				} else {
					pad.downKey = false;
					pad.upKey = false;
				}
			}
		}
	}

	private updatePaddles() {
		this.updateBotPaddle();
		for (const pad of this.paddles.values()) {
			if (this.lobby.gamemode == 'Rumble') pad.updatePowerUp();

			if (pad.upKey) pad.pos.y -= 10 * (pad.isFrozen ? 0.5 : 1);
			if (pad.downKey) pad.pos.y += 10 * (pad.isFrozen ? 0.5 : 1);
			
			if (pad.pos.y < -50) pad.pos.y = -50;
			if (pad.pos.y > 750) pad.pos.y = 750;
		}
	}

	private newPowerUp() {
		this.powerUp = new PowerUp(this.height);
	}

	private updatePowerUp() {
		if (!this.powerUp)
			return ;
		
		let distanceBallPowerUp = (this.ball.pos.x - this.powerUp.pos.x) * (this.ball.pos.x - this.powerUp.pos.x) + (this.ball.pos.y - this.powerUp.pos.y) * (this.ball.pos.y - this.powerUp.pos.y);
		
		if(distanceBallPowerUp <= (this.ball.rad + this.powerUp.rad) * (this.ball.rad + this.powerUp.rad))
		{
			let arr = Array.from(this.paddles.values());
			
			switch(this.powerUp.type){
				case "Freeze":
					Math.cos(this.ball.speed.angle) > 0 ? arr[1].freeze() : arr[0].freeze();
					break;
				case "Giant":
					Math.cos(this.ball.speed.angle) > 0 ? arr[0].giant() : arr[1].giant();
					break;
				case "SpeedUp":
					this.ball.speedUp();
					break;
			}
			this.powerUp = null;
		}
	}

	public async defWin(idLoser: string) {
		if (this.hasStarted && this.hasFinished === false) {
			for (const id of this.lobby.clients.keys()) {
				if (id !== idLoser) {
					// console.log(id);
					this.scores.set(id, 42);
					await this.endgame(id);
				}
			}
			if (this.lobby.gamemode === "PvE")
				this.scores.set(idLoser, 42);
		}
	}

	private nextFrame() {
		if (this.isPaused === false && this.hasStarted) {
			if (this.countdown === 0) {
				if (this.lobby.gamemode == 'Rumble' && Math.floor(Math.random() * 600) == 1)
					this.newPowerUp();
				this.updatePowerUp(); 
				this.updatePaddles();
				this.updateball();
			} else {
				this.countdown -= ((new Date()).getTime() - this.lastUpdate);
				this.countdown = this.countdown < 0 ? 0 : this.countdown;
			}

			this.lastUpdate = (new Date().getTime());
		}
	}

	public async end(): Promise<void> {
		if (!this.hasStarted) return;

		this.hasFinished = true;
		let player1MMR: string = "";
		let player2MMR: string = "";

		for (const client of this.lobby.clients.values()) {
			let playerMMR: string = client.userId + " " + (await this.lobby.getPlayerMMR(client));
			if (player1MMR === "")
				player1MMR = playerMMR;
			else
				player2MMR = playerMMR;
			if (this.lobby.gamemode === "PvE") {
				this.lobby.setStatus(client.userId, "ONLINE");
				this.lobby.quitQueue(client.userId);
			}
		}


		this.lobby.sendEvent<ServerResponseDTO[ServerEvents.GameMessage]>(
			ServerEvents.GameMessage,
			{
				message: "Game is Finished",
				mode: this.lobby.gamemode,
				lobbyId: this.lobby.Id,
				player1MMR: player1MMR,
				player2MMR: player2MMR,
			}
		);
	}

	public movePaddle(data: MovePaddleDTO): void {
		let pad: Paddle = this.paddles.get(data.clientId);
		if (pad && !pad.isCheatedPosition(data.keyPressed)) {
			pad.newPosition(data.keyPressed);
		}
	}
}
