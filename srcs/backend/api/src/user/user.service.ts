import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, User } from "@prisma/client";
import { UserSafeDTO } from "./dto";
import * as fs from "fs";
import { Buffer } from "buffer";
import { join } from "path";
import * as process from "process";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	getUserSafe(user: User): UserSafeDTO {
		let userSafe = user;
		delete userSafe.id42;
		delete userSafe.secret2FA;
		return userSafe;
	}

	async getTrueUser(user: UserSafeDTO): Promise<User> {
		const trueUser = await this.prisma.user.findUnique({
			where: {
				id: user.id
			},
			include: {
				blockedUsers: true
			}
		});
		return trueUser;
	}

	async updateUserImage(
		user: User,
		type: string,
		base64Data: string
	): Promise<{ image: string }> {
		if (type.split("/")[0] != 'image')
			throw new UnauthorizedException();
		
		let buf = Buffer.from(base64Data.split(",")[1], "base64");
		const oldPath = user.image.split(
			`http://${process.env.SERVER_HOSTNAME}:3000/images/`
		)[1];
		if (oldPath && oldPath.split(".")[1] != type.split("/")[1])
			fs.unlink(join(process.cwd(), "images", oldPath), (err) => {});

		let imagePath = new Promise(function (resolve, reject) {
			fs.writeFile(
				join(
					process.cwd(),
					"images",
					user.id + "." + type.split("/")[1]
				),
				buf,
				async (err) => {
					if (err) reject(err);
					else {
						resolve("lol");
					}
				}
			);
		}).then(() => {
			return (
				`http://${process.env.SERVER_HOSTNAME}:3000/images/` +
				user.id +
				"." +
				type.split("/")[1]
			); // Possibilité de mettre le path dans le resolve au lieu de .then
		});
		return imagePath.then(async (val) => {
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					image: val
				}
			});
			return { image: val };
		});
	}

	async updateUserName(
		user: User,
		newName: string
	): Promise<{ name: string }> {
		const regex = new RegExp('^[a-zA-Z0-9-_]{1,15}$')

		if (!regex.test(newName)) throw new UnauthorizedException();
		try {
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					name: newName
				}
			});
			return { name: newName };
		} catch (error) {
			throw new UnauthorizedException();
		}
	}

	async signUp(user: User): Promise<{ signUp: Boolean }> {
		try {
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					signUp: false
				}
			});
			return { signUp: false };
		} catch (error) {
			throw new UnauthorizedException();
		}
	}

	async findUser(username: string): Promise<UserSafeDTO> {
		try {
			const regex = new RegExp('^[a-zA-Z0-9-_]{1,15}$')

			if (!regex.test(username)) return (undefined);
			const user = await this.prisma.user.findUnique({
				where: {
					name: username
				},
				include: {
					gameProfile: {
						include: {
							history: {
								include: {
									winner: {
										include: {
											user: true
										}
									},
									loser: {
										include: {
											user: true
										}
									}
								}
							},
							gameWons: true
						}
					},
					friends: true,
					blockedUsers: true
				},
			});
			return user;
		} catch {
			throw new NotFoundException();
		}
	}

	async addFriend(user: User, friendName: string): Promise<{ name: string }> {
		try {
			const myfriend = await this.prisma.user.findUnique({
				where: {
					name: friendName
				},
				include: {
					friends: true,
					blockedUsers: true
				}
			});

			for (const friend of myfriend.friends) {
					if (friend.id === user.id)
						throw new NotFoundException();
				}
			
			for (const blockedUser of myfriend.blockedUsers) {
					if (blockedUser.id === user.id)
						return ({name: friendName});
				}
			

			await this.prisma.user.update({
				where: {
					id: myfriend.id
				},
				data: {
					pendingFriends: { connect: { id: user.id } }
				}
			});
			return { name: friendName };
		} catch {
			throw new NotFoundException();
		}
	}

	async getFriends(user: any): Promise<{ friends: Array<User> }> {
		try {
			const fullUser = await this.prisma.user.findUnique({
				where: {
					id: user.id
				},
				include: {
					friends: true
				}
			});
			return { friends: fullUser.friends };  
		} catch {
			throw new NotFoundException();
		}
	}

	async getPendingFriends(user: any): Promise<{ friends: Array<User> }> {
		try {
			const fullUser = await this.prisma.user.findUnique({
				where: {
					id: user.id
				},
				include: {
					pendingFriends: true
				}
			});
			return { friends: fullUser.pendingFriends };  
		} catch {
			throw new NotFoundException();
		}
	}

	async getBlockedUsers(user: any): Promise<{friends: Array<User>}> {
		try {
			const fullUser = await this.prisma.user.findUnique({
				where: {
					id: user.id
				},
				include: {
					blockedUsers: true
				},
			});
			return ({friends: fullUser.blockedUsers});  
		} catch {
			throw new NotFoundException();
		}
	}

	async acceptFriend(user: User, friendName: string): Promise<{name: string}> {
		try {
			const myfriend = await this.prisma.user.findUnique({
				where: {
					name: friendName
				}
			});
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					friends: { connect: { id: myfriend.id } }
				}
			});

			await this.prisma.user.update({
				where: {
					id: myfriend.id
				},
				data: {
					friends: { connect: { id: user.id } }
				}
			});

			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					pendingFriends: { disconnect: { id: myfriend.id } }
				}
			});

			await this.prisma.user.update({
				where: {
					id: myfriend.id
				},
				data: {
					pendingFriends: { disconnect: { id: user.id}},
				}
			});


			return ({name: friendName});
		} catch {
			throw new NotFoundException();
		}
	}

	async declineFriend(
		user: User,
		friendName: string
	): Promise<{ name: string }> {
		try {
			const myfriend = await this.prisma.user.findUnique({
				where: {
					name: friendName
				}
			});
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					pendingFriends: { disconnect: { id: myfriend.id } }
				}
			});
			return { name: friendName };
		} catch {
			throw new NotFoundException();
		}
	}

	async deleteFriend(
		user: User,
		friendName: string
	): Promise<{ name: string }> {
		try {
			const myfriend = await this.prisma.user.findUnique({
				where: {
					name: friendName
				}
			});

			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					friends: { disconnect: { id: myfriend.id } }
				}
			});

			await this.prisma.user.update({
				where: {
					id: myfriend.id
				},
				data: {
					friends: { disconnect: { id: user.id } }
				}
			});

			return { name: friendName };
		} catch {
			throw new NotFoundException();
		}
	}

	async getLeaderboardFirsts(user: any): Promise<{leaderboard: Array<User>}> {
		try {
			const fullUser = await this.prisma.user.findMany({
				orderBy: {
					mmr: 'desc'
				},
				take: 3
			});
			return { leaderboard: fullUser };  
		} catch {
			throw new NotFoundException();
		}
	}

	async getLeaderboardOthers(user: any): Promise<{leaderboard: Array<User>}> {
		try {
			const fullUser = await this.prisma.user.findMany({
				orderBy: {
					mmr: 'desc'
				},
				skip: 3
			});
			return ({leaderboard: fullUser});  
		} catch {
			throw new NotFoundException();
		}
	}

	async blockUser(user: any, otherUsername: string): Promise<{name: string}> {
		try {
			const blockedUser = await this.prisma.user.findUnique({
				where: {
					name: otherUsername
				},
			});
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					friends: { disconnect: { id: blockedUser.id } },
					pendingFriends: { disconnect: { id: blockedUser.id } },
					blockedUsers: { connect: { id: blockedUser.id } }
				}
			});

			await this.prisma.user.update({
				where: {
					id: blockedUser.id
				},
				data: {
					friends: { disconnect: { id: user.id } },
					pendingFriends: { disconnect: { id: user.id } },
				}
			});

			return ({name: blockedUser.name});
		} catch {
			throw new NotFoundException();
		}
	}

	async unblockUser(user: any, otherUsername: string): Promise<{name: string}> {
		try {
			const blockedUser = await this.prisma.user.findUnique({
				where: {
					name: otherUsername
				},
			});
			await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					blockedUsers: { disconnect: { id: blockedUser.id } }
				}
			});
			return ({name: blockedUser.name});
		} catch {
			throw new NotFoundException();
		}
	}
}
