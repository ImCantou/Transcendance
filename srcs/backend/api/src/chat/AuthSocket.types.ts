import { Socket } from 'socket.io';

export interface AuthSocket extends Socket {
  userId: number;
  name: string;
}

export interface AuthLobbySocket extends AuthSocket {
  status: string;
}