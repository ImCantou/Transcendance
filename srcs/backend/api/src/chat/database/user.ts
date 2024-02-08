import { Injectable } from "@nestjs/common";
import { Ban, Member, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
class UserDatabase {
	constructor(private prisma: PrismaService) {}

	// Get all the channelid and userid
	async getMembers(userid: number): Promise<Member[]> {
		try {
			return await this.prisma.member.findMany({
				where: {
					userId: userid
				}
			});
		} catch (error) {
			throw error;
		}
	}

	async getMembersfromChannel(channelId: string): Promise<Member[]> {
		try {
			return await this.prisma.member.findMany({
				where: {
					channelId: channelId
				}
			});
		} catch (error) {
			throw error;
		}
	}
	async specificMember(userId: number, channelId: string): Promise<Member[]> {
		try {
			return await this.prisma.member.findMany({
				where: {
					channelId: channelId,
					userId: userId
				}
			});
		} catch (error) {
			throw error;
		}
	}

	async getModo(channelId: string): Promise<{ userId: number }[]> {
		try {
			return await this.prisma.member.findMany({
				where: {
					channelId: channelId,
					isAdmin: true
				},
				select: {
					userId: true
				}
			});
		} catch (error) {
			throw error;
		}
	}
	async getAllChannels(userid: number): Promise<{ channelId: string }[]> {
		try {
			return await this.prisma.member.findMany({
				where: {
					userId: userid
				},
				select: {
					channelId: true
				}
			});
		} catch (error) {
			throw error;
		}
	}

	async getUser(userId: number): Promise<User> {
		try {
			return await this.prisma.user.findUnique({
				where: {
					id: userId
				}
			});
		} catch (error) {
			throw error;
		}
	}

	async isModo(userId: number, channelId: string): Promise<boolean> {
		try {
			const res = await this.prisma.member.findFirst({
				where: {
					userId: userId,
					channelId: channelId
				},
				select: {
					isAdmin: true
				}
			});
			return res.isAdmin;
		} catch (error) {
			throw error;
		}
	}

	async changeModo(
		userId: number,
		channelId: string
	): Promise<{ isModo: boolean; username: string }> {
		const member: Member[] = await this.specificMember(userId, channelId);
		const user: User = await this.getUser(userId);
		await this.prisma.member.update({
			where: {
				id: member[0].id
			},
			data: {
				isAdmin: !member[0].isAdmin
			}
		});
		return { isModo: !member[0].isAdmin, username: user.name };
	}

	async isOwner(userId: number, channelId: string): Promise<boolean> {
		try {
			const res = await this.prisma.channel.findFirst({
				where: {
					id: channelId
				}
			});
			return res.ownerId == userId;
		} catch (error) {
			throw error;
		}
	}

	async isMember(userId: number, channelId: string): Promise<boolean> {
		return (await this.findMember(userId, channelId)) != null;
	}

	async isBan(userId: number, channelId: string): Promise<boolean> {
		return (await this.findBan(userId, channelId)) != null;
	}

	async findMember(userId: number, channelId: string): Promise<Member> {
		try {
			return await this.prisma.member.findFirst({
				where: {
					channelId: channelId,
					userId: userId
				}
			});
		} catch (error) {
			throw error;
		}
	}

	async findBan(userId: number, channelId: string): Promise<Ban> {
		return await this.prisma.ban.findFirst({
			where: {
				channelId: channelId,
				userId: userId
			}
		});
	}

	async getUserFromId(userId: number[]) {
		try {
			return await this.prisma.user.findMany({
				where: {
					id: {
						in: userId
					}
				}
			});
		} catch (error) {
			throw error;
		}
	}
}

export default UserDatabase;
