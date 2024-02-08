import { Socket } from "socket.io";
import { Lobby } from "../Lobby/Lobby";
import { ServerEvents } from "./ServerEvents";

export type AuthenticatedSocket = Socket & {
	data: {
		lobby: null | Lobby;
	};
	userId: number;
	username: string;

	emit: <T>(ev: ServerEvents, data: T) => boolean;
};
