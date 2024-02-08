import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import WebSocketUserMiddleware from "./WebSocketMiddleware";

export class WebSocketAdapter extends IoAdapter {
	constructor(private app: INestApplicationContext) {
		super(app);
	}

	createIOServer(port: number, options?: any) {
		const hostname = (process.env.SERVER_HOSTNAME).toLowerCase();
		const cors = {
			credentials: true,
			origin: [
				`http://${hostname}:8000`,
				`http://${hostname}:3000`
			],
			methods: ["GET", "POST"],
			allowedHeaders: ["Authorization"]
		};
		const optionsWithCors: ServerOptions = {
			...options,
			cors
		};
		const server = super.createIOServer(port, optionsWithCors);
		const prismaService = this.app.get(PrismaService);

		server.use(WebSocketUserMiddleware(prismaService));
		return server;
	}
}
