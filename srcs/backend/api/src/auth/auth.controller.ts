import { Body, Controller, Post, Patch, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TokenDto } from "./dto/token.dto";
import { UnauthorizedException } from "@nestjs/common";
import { JwtGuard } from "src/auth/guard";
import { GetUser } from "src/auth/decorator";
import { User } from "@prisma/client";
import { UserSafeDTO } from "src/user/dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post()
	async auth(@Body() body): Promise<TokenDto | UserSafeDTO> {
		return this.authService.auth(body);
	}

	@Post("2FA/verify")
	async verifyTOTP(@Body() body): Promise<TokenDto> {
		return this.authService.verifyTOTP(body);
	}

	@UseGuards(JwtGuard)
	@Post("2FA/generate")
	async generate2FA(@GetUser() user: User): Promise<{ qrCodeUrl: string }> {
		return this.authService.generate2FA(user);
	}

	@UseGuards(JwtGuard)
	@Patch("2FA/turn-on")
	async turnOn2FA(
		@GetUser() user: User,
		@Body() body
	): Promise<{ status: boolean }> {
		return this.authService.turnOn2FA(user, body);
	}

	@UseGuards(JwtGuard)
	@Patch("2FA/turn-off")
	async turnOff2FA(@GetUser() user: User): Promise<{ status: boolean }> {
		return this.authService.turnOff2FA(user);
	}
}
