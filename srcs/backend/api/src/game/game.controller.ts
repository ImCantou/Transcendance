
import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { GameProfile, User } from "@prisma/client"
import { GetUser } from "src/auth/decorator";
import { GameService } from "./game.service";

@Controller()
export class GameController {
	constructor(private readonly GameService: GameService) {}

	@Get("getGameProfile")
	getGameProfile(@GetUser() user: User): Promise<GameProfile> {
		return this.GameService.getGameProfile(user);
	}

}
