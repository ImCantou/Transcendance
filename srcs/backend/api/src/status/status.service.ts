import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthenticatedSocket } from "src/game/types/AuthenticatedSocket";
import { UserStatus } from "@prisma/client";
import { Server } from "socket.io";
import { StatusGateway } from "./status.gateaway";

@Injectable()
export class StatusService {
	constructor(private prisma: PrismaService) {}

	async handleConnection(client: AuthenticatedSocket) {
		try {
			const ret = await this.prisma.user.update({
				where: {
					id: client.userId
				},
				data: {
					status: UserStatus.ONLINE
				}
			});
		} catch (error) {
			console.log(error.message);
		}
	}

	async handleDisconnect(client: AuthenticatedSocket) {
		try {
			await this.prisma.user.update({
				where: {
					id: client.userId
				},
				data: {
					status: UserStatus.OFFLINE
				}
			});
		} catch (error) {
			console.log(error.message);
		}
	}
}
