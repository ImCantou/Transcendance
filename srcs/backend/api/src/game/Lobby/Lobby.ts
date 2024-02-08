import { Server } from "socket.io";
import { v4 } from "uuid";
import { Socket } from "socket.io";
import { AuthenticatedSocket } from "../types/AuthenticatedSocket";
import { Pong } from "../Pong/Pong";
import { ServerEvents } from "../types/ServerEvents";
import { ServerResponseDTO } from "../types/ServerResponseDTO";
import { Paddle } from "../Pong/types/Paddle";
import { Point } from "../Pong/types/Point";
import { PrismaService } from "src/prisma/prisma.service";
import { Game, GameStatus } from "@prisma/client";
import { LobbyMode } from "./lobby.types";
import { UserStatus } from "@prisma/client";
import { ServerResponse } from "http";


export class Lobby {
	private prisma: PrismaService;
	public Id: string;
	public startedAt: number;


	public readonly clients: Map<Socket["id"], AuthenticatedSocket> = new Map<
		Socket["id"],
		AuthenticatedSocket
	>();

	public readonly game: Pong = new Pong(this);

	constructor(
		private readonly server: Server,
		public readonly maxClients: number,
		public gamemode: LobbyMode,
		prisma: PrismaService
	) {
		this.prisma = prisma;
	}

	public async addToDb() {
		try {
			const prismGame: any = await this.prisma.game.create({
				data: {
					gamemode: this.gamemode
				}
			});

			this.Id = prismGame.id;
		} catch (err) {
			console.log(err);
		}
	}

	public async quitQueue(clientid: number) {
		await this.prisma.gameProfile.update({
			where: {
				userId: clientid
			},
		data: {
			status: GameStatus.IDLE,
		}});
	}

	public async refreshAuthSocket(id: string) {
		let client: AuthenticatedSocket = this.clients.get(id);
		if (client)
			client.username = (await (this.prisma.user.findUnique({where: {id : client.userId}}))).name;
	}

	public async setStatus(clientid: number, status: string) {
		if (status === "INGAME") {
			await this.prisma.user.update({
				where: {
					id: clientid
				},
			data: {
				status: UserStatus.INGAME,
			}});
		}
		else if (status === "ONLINE") {
			if ((await this.prisma.user.findUnique({where: {id: clientid}})).status === UserStatus.INGAME) {
				await this.prisma.user.update({
					where: {
						id: clientid
					},
				data: {
					status: UserStatus.ONLINE,
				}});
			}
		}
	}

	public async endInstance(winnerId: number, loserId: number) {
		try { 
			if (this.gamemode !== 'PvE') {
				const winner: any = await this.prisma.user.findFirst({
					where: {
						id: winnerId
					}
				});

				// console.log(winner);

				const loser: any = await this.prisma.user.findFirst({
					where: {
						id: loserId
					}
				});

				// console.log(loser);
				if (this.gamemode === "PvP") {
					let mmrUpdate: number =
						25 +
						(Math.round((loser.mmr - winner.mmr) / 50) > 15
							? 15
							: Math.round((loser.mmr - winner.mmr) / 50) < -15
							? -15
							: Math.round((loser.mmr - winner.mmr) / 50));


				
					await this.prisma.user.update({
						where: {
							id: loser.id
						},
						data: {
							mmr: loser.mmr - mmrUpdate,
						}
					});
	
					await this.prisma.user.update({
						where: {
							id: winner.id
						},
						data: {
							mmr: winner.mmr + mmrUpdate
						}
					});
	
				}

				await this.prisma.gameProfile.update({
					where: {
						userId: winnerId,
					},
					data: {
						status: GameStatus.IDLE,
						lobby: "",

					}
				})

				await this.prisma.gameProfile.update({
					where: {
						userId: loserId,
					},
					data: {
						status: GameStatus.IDLE,
						lobby: "",
					}
				})

				await this.prisma.game.update({
					where: {
						id: this.Id
					},
					data: {
						winner: {
							connect: {
								userId: winner.id
							}
						},
						loser: {
							connect: {
								userId: loser.id
							}
						},
						players: {
							connect: [{userId: winner.id}, {userId: loser.id}]

						},
						scores: Array.from(this.game.scores.values()),
						isStarted: true,
						timerMS: new Date().getTime() - this.game.startTimer
					}
				});
				await this.setStatus(winnerId, "ONLINE");
				await this.setStatus(loserId, "ONLINE");
			}
		} catch (err) {
			console.log(err);
		}
	}

	public async removeClient(client: AuthenticatedSocket): Promise<void> {
		if (this.game.hasStarted)
			await this.game.defWin(client.id);
		
		this.clients.delete(client.id);
		try {
			await this.setStatus(client.userId, "ONLINE");

			await this.prisma.gameProfile.update({
				where: {
					userId: client.userId,
				},
				data: {
					status: GameStatus.IDLE,
					lobby: "",
				}
			})
		} catch(error) {
			console.log(error);
		}
		// this.clients.delete(client.id);
	}

	public sendLobbyState(): void {
		function MapToRecord<V>(map: Map<string, V>): Record<string, V> {
			let newRecord: Record<string, V> = {};
			for (let [key, value] of map) {
				newRecord[key] = value;
			}
			return newRecord;
		}

		function MapToRecordName(map: Map<string, AuthenticatedSocket>, gamemode: LobbyMode): Record<string, string> {
			let newRecord: Record<string, string> = {};
			for (let [key, value] of map) {
				newRecord[key] = value.username;
			}
			if (gamemode === "PvE")
				newRecord["bot"] = "bot";

			return newRecord;
		}

		const payload: ServerResponseDTO[ServerEvents.LobbyState] = {
			lobbyId: this.Id,
			lobbyMode: this.gamemode,
			hasStarted: this.game.hasStarted,
			hasFinished: this.game.hasFinished,
			countdown: this.game.countdown,
			isPaused: this.game.isPaused,
			playersCount: this.clients.size,
			gameWidth: this.game.width,
			gameHeight: this.game.height,
			powerUpPosition: (this.game.powerUp) ? this.game.powerUp.pos : null,
			powerUpType: (this.game.powerUp) ? this.game.powerUp.type : null,
			ballPosition: this.game.ball.pos,
			ballSpeedUp: this.game.ball.speedPowerUp,
			padPositions: MapToRecord(this.game.paddles),
			scores: MapToRecord(this.game.scores),
			playerNames: MapToRecordName(this.clients, this.gamemode),
			timeleft: this.game.endTimer - (new Date().getTime() - this.game.startTimer),
		};

		this.sendEvent<ServerResponseDTO[ServerEvents.LobbyState]>(
			ServerEvents.LobbyState,
			payload
		);
	}

	public sendEvent<T>(event: ServerEvents, payload: T): void {
		this.server.to(this.Id).emit(event, payload);
	}

	public async getPlayerMMR(client: AuthenticatedSocket): Promise<number> {
		return (await this.prisma.user.findUnique({where: {id: client.userId}})).mmr; 
	}

	private async startGame() {
		await this.prisma.game.update({
			where : {
				id: this.Id
			},
			data: {
				isStarted: true
			}
		});
		await this.game.start();
		this.startedAt = new Date().getTime();
	}

	public async addClient(client: AuthenticatedSocket): Promise<void> {
		this.clients.set(client.id, client);
		client.join(this.Id);
		client.data.lobby = this;

		if (this.clients.size >= this.maxClients) {
			await this.startGame();
		}
	}
}
