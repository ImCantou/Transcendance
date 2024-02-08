import { Injectable } from "@nestjs/common";
import { GameProfile, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { GameGateway } from "./game.gateway";
import { AuthenticatedSocket } from "./types/AuthenticatedSocket";

@Injectable()
export class GameService {
	constructor(
		public prisma: PrismaService) {}

	async getGameProfile(user: User): Promise<GameProfile> {
		return await this.prisma.gameProfile.findUnique({where: {userId: user.id}})
	}

	async updateSocket(client: AuthenticatedSocket) {
		const updateGameProfile = await this.prisma.gameProfile.upsert({
			where: {
				userId: client.userId,
			},
			update: {
				playSocketId: client.id,
			},
			create: {
				playSocketId: client.id,
				userId: client.userId
			}
		});
	}
}