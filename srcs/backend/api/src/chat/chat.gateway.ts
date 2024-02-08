import { Injectable, UseGuards } from "@nestjs/common";
import {
	WebSocketGateway,
	WebSocketServer,
	ConnectedSocket,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { verify } from "jsonwebtoken";
import { MessagePayload, MessageSend } from "./dto/chat";
import { Member, User } from "@prisma/client";
import { AuthSocket } from "./AuthSocket.types";
import { WsGuard } from "./WsGuard";
import { JwtPayload } from "src/auth/dto/jwtPayload.dto";
import UserDatabase from "./database/user";
import { stat } from "fs";

@Injectable()
@WebSocketGateway({
	path: "/chatSocket"
})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private user: UserDatabase) {}

	@WebSocketServer()
	public server: Server;

	afterInit(server: Server) {
		server.on("connection", (socket: Socket) => {});
	}

	getId(client: AuthSocket): number {
		if (client.handshake.headers.authorization == undefined) return null;

		try {
			const decoded: string | JwtPayload | any = verify(
				client.handshake.headers.authorization.split(" ")[1],
				process.env.JWT_SECRET
			);
			return decoded.sub;
		} catch (ex) {
			return ex;
		}
	}

	@UseGuards(WsGuard)
	async handleConnection(@ConnectedSocket() client: AuthSocket) {
		client.join(String(this.getId(client)));
	}

	async handleDisconnect(@ConnectedSocket() client: AuthSocket) {
		client.leave(String(client.userId));
	}

	async emitToRoom(users: Member[], message: MessagePayload, status: string) {
		let user: User = await this.user.getUser(message.authorId);
		let res: MessageSend = {
			id: message.id,
			createdAt: message.createdAt,
			updateAt: message.updateAt,
			channelId: message.channelId,
			authorId: message.authorId,
			content: message.content,
			username: user.name,
			avatar: user.image,
			link: message.link
		};

		this.emitToMany(users, res, status);
	}

	emitToMany(users: { userId: number }[], message: any, status: string) {
		users.map((user) => {
			this.emit(user.userId, message, status);
		});
	}

	emit(userId: number, send: any, status: string) {
		this.server.to(String(userId)).emit(status, send);
	}
}
