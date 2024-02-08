import { io, Socket } from "socket.io-client";
import { createContext } from "react";
import { Listener, ServerEvents, ClientEvents } from "./types";
import getJwtTokenFromCookie from "../getJWT";

type EmitOptions<T> = {
	event: ClientEvents;
	data?: T;
};

export default class SocketWrapper {
	public readonly socket: Socket;
	private connectionLost: boolean = false;

	constructor() {
		this.socket = io(
			`http://${import.meta.env.VITE_SERVER_HOSTNAME}:3000/`,
			{
				path: "/game",
				transportOptions: {
					polling: {
						extraHeaders: {
							Authorization: "Bearer " + getJwtTokenFromCookie()
						}
					}
				}
			}
		);
		this.socket.connect();

		this.onConnect();
		this.onDisconnect();
		this.onException();
	}

	getSocketId(): string {
		if (!this.socket.connected) {
			return "";
		}

		return this.socket.id;
	}

	emit<T>(options: EmitOptions<T>): this {
		this.socket.emit(options.event, options.data);

		return this;
	}

	addListener<T>(event: ServerEvents, listener: Listener<T>): this {
		this.socket.on(event, listener);

		return this;
	}

	removeListener<T>(event: ServerEvents, listener: Listener<T>): this {
		this.socket.off(event, listener);

		return this;
	}

	private onConnect(): void {
		this.socket.on("connect", () => {
			if (this.connectionLost) {
				console.log("reconnecting to server");
				this.connectionLost = false;
			}
		});
	}

	private onDisconnect(): void {
		this.socket.on("disconnect", async (reason: string) => {
			if (reason === "io client disconnect") {
			}
		});
	}

	private onException(): void {
		this.socket.on("exception", (data: string) => {
			console.log(data);
		});
		return;
	}
}

const socketWrapper = new SocketWrapper();

export const SocketWrapperContext = createContext<SocketWrapper>(socketWrapper);
export const SocketWrapperProvider = SocketWrapperContext.Provider;
