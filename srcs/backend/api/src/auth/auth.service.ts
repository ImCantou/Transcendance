import {
	BadGatewayException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, User } from "@prisma/client";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom, map } from "rxjs";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import * as process from "process";
import { UserData42Dto } from "./dto/userData42.dto";
import { JwtService } from "@nestjs/jwt";
import { TokenDto } from "./dto/token.dto";
import { authenticator } from "otplib";
import { toDataURL } from "qrcode";
import { UserSafeDTO } from "src/user/dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private httpService: HttpService,
		private jwt: JwtService,
		private userService: UserService
	) {}

	/* Services */

	async auth(body): Promise<TokenDto | UserSafeDTO> {
		if (body.error || !body.code) throw new UnauthorizedException();

		const token42 = await this.getToken42(body.code);
		if (!token42) throw new BadGatewayException();

		const userData42 = await this.getUserData42(token42);
		if (!userData42) throw new BadGatewayException();

		const user = await this.login(userData42);

		if (user.is2FAOn) {
			return this.userService.getUserSafe(user);
		} else {
			return await this.signToken(user);
		}
	}

	async verifyTOTP(body): Promise<TokenDto> {
		const trueUser = await this.userService.getTrueUser(body.user);
		const isOTPValid = await this.verifyTOTPValid(trueUser, body.OTP);
		if (!isOTPValid) throw new UnauthorizedException();
		return await this.signToken(body.user);
	}

	async generate2FA(user: User): Promise<{ qrCodeUrl: string }> {
		const otpAuthUrl = await this.generate2FASecretQRCode(user);
		const qrCodeUrl = await this.generateQRCodeDataURL(otpAuthUrl);
		return {
			qrCodeUrl
		};
	}

	async turnOn2FA(user: User, body): Promise<{ status: boolean }> {
		if (!user.secret2FA) throw new UnauthorizedException();
		const isTOTPValid = await this.verifyTOTPValid(user, body.TOTP);
		if (!isTOTPValid) throw new UnauthorizedException();
		const status = await this.turnOnOff2FA(user, true);
		return { status: status };
	}

	async turnOff2FA(user: User): Promise<{ status: boolean }> {
		const status = await this.turnOnOff2FA(user, false);
		return { status: status };
	}

	/* ---------------------------------------------------------------------------------------------- */

	/* 2FA */

	async generate2FASecretQRCode(user: User): Promise<string> {
		const secret2FA = authenticator.generateSecret();
		try {
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					secret2FA: secret2FA
				}
			});
		} catch {
			throw new ForbiddenException();
		}

		const otpAuthUrl = authenticator.keyuri(
			user.name,
			"Transcendance",
			secret2FA
		);
		return otpAuthUrl;
	}

	async generateQRCodeDataURL(otpAuthUrl: string): Promise<string> {
		return toDataURL(otpAuthUrl);
	}

	async verifyTOTPValid(user: User, TOTP: string): Promise<boolean> {
		return authenticator.verify({
			token: TOTP,
			secret: user.secret2FA
		});
	}

	async turnOnOff2FA(user: User, status: boolean) {
		try {
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					is2FAOn: status
				}
			});
		} catch {
			throw new ForbiddenException();
		}
		return status;
	}

	/* ---------------------------------------------------------------------------------------------- */

	/* AUTH */

	async getToken42(code: string) {
		const requestConfig: AxiosRequestConfig = {
			params: {
				grant_type: "authorization_code",
				client_id: process.env.API42_UID,
				client_secret: process.env.API42_SECRET,
				code: code,
				redirect_uri: process.env.REDIRECT_URI
			}
		};
		try {
			const responseData = await lastValueFrom(
				this.httpService
					.post(
						"https://api.intra.42.fr/oauth/token",
						null,
						requestConfig
					)
					.pipe(
						map((response: AxiosResponse) => {
							return response.data;
						})
					)
			);
			return responseData;
		} catch (error) {
			console.log(`${error.message}: ${error.code}`);
			throw new BadGatewayException();
		}
	}

	async getUserData42(token: any): Promise<UserData42Dto> {
		try {
			const requestConfig: AxiosRequestConfig = {
				headers: {
					Authorization: `Bearer ${token.access_token}`
				}
			};
			const responseData = await lastValueFrom(
				this.httpService
					.get("https://api.intra.42.fr/v2/me", requestConfig)
					.pipe(
						map((response: AxiosResponse) => {
							return response.data;
						})
					)
			);

		const userData42: UserData42Dto = {
			id: responseData.id,
			login: responseData.login,
			image: responseData.image.link
		};
		return userData42;
		} catch (error) {
			throw new BadGatewayException();
		}
	}

	async login(userData42: UserData42Dto): Promise<User> {
		let user: User;
		try {
			user = await this.prisma.user.findUniqueOrThrow({
				where: {
					id42: userData42.id
				}
			});
		} catch (error) {
			let username = userData42.login;
			while (!user) {
				try {
					user = await this.prisma.user.create({
						data: {
							name: username,
							image: userData42.image,
							id42: userData42.id
						}
					});
				} catch (error) {
					if (
						error instanceof Prisma.PrismaClientKnownRequestError &&
						error.code === "P2002"
					) {
						username += "-";
						continue;
					}
				}
			}
		}
		return user;
	}

	async signToken(user: User): Promise<TokenDto> {
		const payload = {
			sub: user.id,
			name: user.name,
			is2FAOn: user.is2FAOn
		};

		const token = await this.jwt.signAsync(payload, {
			expiresIn: 7 * 24 * 3600000,
			secret: process.env.JWT_SECRET
		});

		return {
			access_token: token
		};
	}
}
