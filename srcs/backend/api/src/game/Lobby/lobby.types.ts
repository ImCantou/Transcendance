import { IsString } from "class-validator";

export class LobbyCreateDto
{
	@IsString()
	mode: LobbyMode
}

export class LobbyJoinDto
{
	@IsString()
	lobbyId: string;

	mode: LobbyMode;
}

export type LobbyMode = 'PvE' | 'PvP' | 'Rumble' | 'Private';