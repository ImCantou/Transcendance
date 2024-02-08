import { AuthenticatedSocket } from "src/game/types/AuthenticatedSocket";
import { PrismaService } from "src/prisma/prisma.service";
import * as jwt from "jsonwebtoken";
import { Socket } from "socket.io";

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

function WebSocketUserMiddleware(prisma: PrismaService): SocketMiddleware {
	return async (socket: Socket, next) => {
		const authSocket = socket as AuthenticatedSocket;
		let jwtData: any;
		try {
			const token: string =
				socket.handshake.headers.authorization.split(" ")[1];
			jwtData = jwt.verify(token, process.env.JWT_SECRET);
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					name: jwtData.name
				}
			});
			authSocket.username = user.name;
			authSocket.userId = user.id;
			// console.log("-------------------------");
			// console.log("\nmiddeware yes!\n");
			// console.log(`user.name = ${user.name}\n`);
			next();
		} catch (error) {
			// console.log("-------------------------");
			// console.log("\nmiddeware no!\n");
			// console.log(`jwtData -> ${jwtData}\n`);
			// if (!jwtData) console.log("jwt data undefined!\n");
			// else console.log(`jwtData.name -> ${jwtData.name}\n`);
			next({
				name: "Unauthorized",
				message: "Socket Unauthorized"
			});
		}
	};
}

export default WebSocketUserMiddleware;
