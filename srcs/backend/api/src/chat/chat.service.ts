import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common";
import { Channel, Member, Message, Status, User } from "@prisma/client";
import UserDatabase from "./database/user";
import ChannelDatabase from "./database/channel";
import {
	ChannelBan,
	ChannelChangement,
	ChannelCreation,
	ChannelInfo,
	ChannelJoin,
	ChannelKick,
	ChannelMute,
	ChannelNewPassword,
	ChannelPayload,
	ListChannel,
	MessageWrite
} from "./dto/chat";
import { PrismaService } from "src/prisma/prisma.service";
import { ChatGateway } from "./chat.gateway";
import * as bcrypt from "bcrypt";

@Injectable()
export class ChatService {
	constructor(
		private userdb: UserDatabase,
		private channeldb: ChannelDatabase,
		private chatGateway: ChatGateway,
		private prisma: PrismaService
	) {}

	async getData(user: User): Promise<ListChannel> {
		const members: Member[] = await this.userdb.getMembers(user.id);
		let res: ListChannel = {};

		if (members != undefined) {
			for (let i: number = 0; i < members.length; i++)
				res[members[i].channelId] = await this.getChannel(
					members[i].channelId,
					user.id
				);
		}
		return res;
	}

	async getDirect(user: User): Promise<ListChannel> {
		const members: Member[] = await this.userdb.getMembers(user.id);
		let res: ListChannel = {};

		if (members != undefined) {
		}
		return res;
	}

	async getChannel(
		channelId: string,
		userId: number
	): Promise<ChannelPayload> {
		const channel: Channel = await this.channeldb.getChannelInfoId(
			channelId,
			userId
		);
		const messages: Message[] = await this.channeldb.getChannelMessage(
			channelId
		);
		return await {
			id: channel.id,
			name: channel.name,
			direct: channel.direct,
			status: this.channeldb.convertString(channel.status),
			message: messages
		};
	}

	// Creation of a channel
	async createChannel(
		user: User,
		channel: ChannelCreation
	): Promise<ChannelPayload> {
		if (channel.name.length == 0) return null;
		const res: Channel = await this.channeldb.createChannel(
			channel,
			user.id
		);
		return {
			id: res.id,
			name: res.name,
			direct: res.direct,
			status: this.channeldb.convertString(res.status),
			message: []
		};
	}

	async fusionSameName(
		userId: number,
		name: string,
		channel: Channel[],
		old: ChannelInfo[]
	) {
		let res = old;
		for (let i: number = 0; i < channel.length; i++) {
			if (name == "" || channel[i].name.startsWith(name)) {
				res.push({
					id: channel[i].id,
					name: channel[i].name,
					status: this.channeldb.convertString(channel[i].status)
				});
			}
		}
		return res;
	}

	async message(user: User, message: MessageWrite): Promise<string> {
		const member: Member = await this.userdb.findMember(
			user.id,
			message.channelId
		);
		const members: Member[] = await this.userdb.getMembersfromChannel(
			message.channelId
		);
		if (
			member == undefined ||
			(member.mute &&
				(member.muteEnd == null ||
					member.muteEnd.getTime() > Date.now()))
		) {
			return "You cannot send message in this channel, refresh the page";
		}
		if (message.content.length == 0) {
			return "No empty message";
		}
		const msg: Message = await this.channeldb.stockMessages(message);
		await this.chatGateway.emitToRoom(members, msg, "onMessage");
		return "";
	}

	// Give all the public channel the user is not in
	async publicChannel(user: User) {
		const channels: Channel[] = await this.channeldb.getPublicChannel();
		let res: ChannelInfo[] = [];
		for (let i = 0; channels != undefined && i < channels.length; i++)
			if (
				!(
					(await this.userdb.isMember(user.id, channels[i].id)) ||
					(await this.userdb.isBan(user.id, channels[i].id))
				)
			)
				res.push({
					id: channels[i].id,
					name: channels[i].name,
					status: channels[i].status
				});
		return res;
	}

	// Give all the protected channel the user is not in
	async protectedChannel(user: User) {
		const channels: Channel[] = await this.channeldb.getProtectChannel();
		let res: ChannelInfo[] = [];
		for (let i = 0; channels != undefined && i < channels.length; i++)
			if (
				!(
					(await this.userdb.isMember(user.id, channels[i].id)) ||
					(await this.userdb.isBan(user.id, channels[i].id))
				)
			)
				res.push({
					id: channels[i].id,
					name: channels[i].name,
					status: channels[i].status
				});
		return res;
	}

	async searchChannel(
		user: User,
		body: { name: string }
	): Promise<ChannelInfo[]> {
		const publicChannel: Channel[] =
			await this.channeldb.getPublicChannel();
		const protectChannel: Channel[] =
			await this.channeldb.getProtectChannel();
		let res: ChannelInfo[] = [];
		res = await this.fusionSameName(user.id, body.name, publicChannel, res);
		res = await this.fusionSameName(
			user.id,
			body.name,
			protectChannel,
			res
		);
		return await res;
	}

	async checkPassword(
		searchChannel: Channel,
		channelJoin: ChannelJoin
	): Promise<Boolean> {
		const isMatch = await bcrypt.compare(
			channelJoin.password,
			searchChannel.password
		);
		return isMatch;
	}

	async joinChannel(
		user: User,
		channel: ChannelJoin
	): Promise<ChannelPayload> {
		const searchChannel: Channel = await this.channeldb.getChannelInfoId(
			channel.id,
			user.id
		);
		if (
			searchChannel == null ||
			(searchChannel.status == Status.PROTECT &&
				!(await this.checkPassword(searchChannel, channel)))
		) {
			throw new UnauthorizedException();
		}
		if (
			(await this.channeldb.findBanChannel(channel.id, user.id)) !=
			undefined
		) {
			throw new UnauthorizedException();
		}
		await this.channeldb.joinChannel(searchChannel.id, user.id);
		if (searchChannel.ownerId == user.id)
			await this.userdb.changeModo(user.id, searchChannel.id);
		return await this.getChannel(searchChannel.id, user.id);
	}

	async deleteMember(channelId: string, userId: number): Promise<boolean> {
		try {
			const channel: Channel = await this.prisma.channel.findFirst({
				where: {
					id: channelId
				}
			});
			if (channel.direct) return;
		} catch (error) {
			return false;
		}
		const find: Member = await this.userdb.findMember(userId, channelId);
		if (find == undefined) throw new UnauthorizedException();
		await this.prisma.member.delete({
			where: { id: find.id }
		});
		let number: number = await this.prisma.member.count({
			where: {
				channelId: channelId
			}
		});
		if (number == 0) {
			try {
				await this.prisma.message.deleteMany({
					where: {
						channelId: channelId
					}
				});
				await this.prisma.channel.delete({
					where: {
						id: channelId
					}
				});
			} catch (error) {
				throw error;
			}
		}
		return true;
	}

	async quitChannel(user: User, channelId: { id: string }) {
		await this.deleteMember(channelId.id, user.id);
	}

	async checkRight(
		userId: number,
		channelId: string,
		victimId: number
	): Promise<boolean> {
		// Owner can do anything he want
		if (await this.userdb.isOwner(userId, channelId))
			return !(await this.userdb.isOwner(victimId, channelId));
		else if (await this.userdb.isModo(userId, channelId)) {
			return !(
				(await this.userdb.isOwner(victimId, channelId)) ||
				(await this.userdb.isModo(victimId, channelId))
			);
		}
		return false;
	}

	// it's just quit with a1C274C check if you are a modo
	async kick(user: User, body: ChannelKick) {
		if (!(await this.checkRight(user.id, body.id, body.invited)))
			throw new UnauthorizedException();
		await this.deleteMember(body.id, body.invited);
		await this.chatGateway.emitToMany(
			[{ userId: body.invited }],
			{ status: "delete", id: body.id },
			"onUpdate"
		);
		const banUser: User = await this.userdb.getUser(body.invited);
		await this.chatGateway.emitToMany(
			await this.userdb.getModo(body.id),
			{
				status: "any",
				content: `${banUser.name} is kick from this channel`
			},
			"onModo"
		);
	}

	async mute(user: User, body: ChannelMute) {
		if (!(await this.checkRight(user.id, body.id, body.muted)))
			throw new UnauthorizedException();
		const find: Member = await this.userdb.findMember(body.muted, body.id);
		try {
			await this.prisma.member.update({
				where: {
					id: find.id
				},
				data: {
					mute: true,
					muteEnd: body.until
				}
			});
			const muteUser: User = await this.userdb.getUser(body.muted);
			await this.chatGateway.emitToMany(
				await this.userdb.getModo(body.id),
				{ status: "any", content: `${muteUser.name} mute` },
				"onModo"
			);
		} catch (error) {
			throw new NotFoundException();
		}
	}

	async unmute(user: User, body: ChannelMute) {
		if (!(await this.checkRight(user.id, body.id, body.muted)))
			throw new UnauthorizedException();
		const find: Member = await this.userdb.findMember(body.muted, body.id);
		try {
			await this.prisma.member.update({
				where: {
					id: find.id
				},
				data: {
					mute: false,
					muteEnd: null
				}
			});
			const muteUser: User = await this.userdb.getUser(body.muted);
			await this.chatGateway.emitToMany(
				await this.userdb.getModo(body.id),
				{ status: "any", content: `${muteUser.name} unmute` },
				"onModo"
			);
		} catch {
			throw new NotFoundException();
		}
	}

	async ban(user: User, body: ChannelBan) {
		if (!(await this.checkRight(user.id, body.id, body.invited)))
			throw new UnauthorizedException();
		await this.channeldb.banChannel(body.id, body.invited);
		await this.deleteMember(body.id, body.invited);
		await this.chatGateway.emitToMany(
			[{ userId: body.invited }],
			{ status: "delete", id: body.id },
			"onUpdate"
		);
		const userBan: User = await this.userdb.getUser(body.invited);
		await this.chatGateway.emitToMany(
			await this.userdb.getModo(body.id),
			{ status: "any", content: `${userBan.name} is ban` },
			"onModo"
		);
	}

	async unban(user: User, body: { id: string; channelId: string }) {
		if (
			!(
				(await this.userdb.isOwner(user.id, body.channelId)) ||
				(await this.userdb.isModo(user.id, body.channelId))
			)
		)
			throw new UnauthorizedException();

		const username: string = await this.channeldb.unbanChannel(body.id);
		await this.chatGateway.emitToMany(
			await this.userdb.getModo(body.channelId),
			{
				status: "any",
				content: `${username} is no longer ban in this channel`
			},
			"onModo"
		);
	}

	async password(user: User, body: ChannelNewPassword) {
		if (!(await this.userdb.isOwner(user.id, body.id)))
			throw new UnauthorizedException();
		await this.prisma.channel.update({
			where: { id: body.id },
			data: {
				password: body.password
			}
		});
	}

	async listUser(
		user: User,
		channelId: string
	): Promise<
		{
			isAdmin: boolean;
			mute: boolean;
			muteEnd: Date;
			user: { id: number; name: string; image: string };
			channel: { ownerId: number };
		}[]
	> {
		if (await this.userdb.isMember(user.id, channelId))
			return await this.channeldb.getChannelUser(channelId);
		throw new UnauthorizedException();
	}

	async listBan(
		user: User,
		channelId: string
	): Promise<
		{
			id: string;
			user: { id: number; name: string; image: string };
		}[]
	> {
		if (await this.userdb.isMember(user.id, channelId))
			return await this.channeldb.getChannelBan(channelId);
		throw new UnauthorizedException();
	}

	async getChannelInfo(user: User, channelId: string): Promise<Channel> {
		if (await this.userdb.isMember(user.id, channelId))
			return await this.channeldb.getChannelInfoId(channelId, user.id);
		throw new UnauthorizedException();
	}

	async channelChangement(user: User, body: ChannelChangement) {
		if (await this.userdb.isOwner(user.id, body.id)) {
			const members: Member[] = await this.userdb.getMembersfromChannel(
				body.id
			);
			const res = await this.channeldb.setChannel(user.id, body.id, body);
			await this.chatGateway.emitToMany(
				members,
				{ status: "channel", id: body.id, name: body.name },
				"onUpdate"
			);
			return res;
		}
	}

	async deleteChannel(user: User, body: { id: string }) {
		if (await this.userdb.isOwner(user.id, body.id)) {
			const members: Member[] = await this.userdb.getMembersfromChannel(
				body.id
			);
			await this.chatGateway.emitToMany(
				members,
				{ status: "delete", id: body.id },
				"onUpdate"
			);
			return await this.channeldb.delete(body.id);
		}
		throw new UnauthorizedException();
	}

	async createDirect(me: User, user: number[]) {
		let check: {
			id: string;
			name: string;
			status: Status;
			direct: boolean;
			Message: Message[];
		} = await this.channeldb.findDirectChannel(user);
		let channel: Channel;
		if (check == null) channel = await this.channeldb.createDirect(user);
		else return;
		let res: ChannelPayload = {
			id: channel.id,
			name: channel.name,
			direct: channel.direct,
			status: this.channeldb.convertString(channel.status),
			message: []
		};
		if (user[0] == user[1]) {
			this.chatGateway.emit(user[0], res, "onChannel");
			return res;
		}
		try {
			let users: User[] = await this.prisma.user.findMany({
				where: {
					id: { in: user }
				}
			});
			res.name = String(users[1].name);
			this.chatGateway.emit(users[0].id, res, "onChannel");
			res.name = String(users[0].name);
			this.chatGateway.emit(users[1].id, res, "onChannel");
		} catch (error) {
			throw new NotFoundException();
		}
		return res;
	}

	async getOtherInfo(userId: number, channelId: string): Promise<User> {
		try {
			let member: Member[] = await this.prisma.member.findMany({
				where: {
					channelId: channelId
				}
			});
			if (member.length > 1) {
				member[0].userId == userId
					? (member[0] = member[1])
					: (member[1] = member[0]);
			}
			return await this.prisma.user.findFirst({
				where: { id: member[0].userId }
			});
		} catch (error) {
			return error;
		}
	}

	async changeModo(user: User, body: { userId: number; channelId: string }) {
		if (!(await this.userdb.isOwner(user.id, body.channelId)))
			throw new UnauthorizedException();
		const modo: { isModo: boolean; username: string } =
			await this.userdb.changeModo(body.userId, body.channelId);
		await this.chatGateway.emitToMany(
			await this.userdb.getModo(body.channelId),
			{
				status: "any",
				content: modo.isModo
					? `${modo.username} became a modo`
					: `${modo.username} is no longer a modo`
			},
			"onModo"
		);
		await this.chatGateway.emit(body.userId, { status: "any" }, "onStatus");
	}

	async fight(user: User, channelId: string): Promise<string> {
		let otherUser = await this.getOtherInfo(user.id, channelId);

		const realFirstUser = await this.prisma.gameProfile.findUnique({
			where: {
				userId: user.id
			}
		});

		const realSecondUser = await this.prisma.gameProfile.findUnique({
			where: {
				userId: otherUser.id
			}
		});

		if (
			realFirstUser.lobby == "" &&
			realFirstUser.status == "IDLE" &&
			realSecondUser.lobby == "" &&
			realSecondUser.status == "IDLE"
		) {
			const prismGame: any = await this.prisma.game.create({
				data: {
					gamemode: "Private"
				}
			});

			await this.prisma.gameProfile.update({
				where: {
					userId: user.id
				},
				data: {
					lobby: prismGame.id
				}
			});

			return prismGame.id;

			/*await this.prisma.gameProfile.update({
				where: {
					userId: user.id
				},
				data: {
					lobby: gameId
				}
			});

			await this.prisma.gameProfile.update({
				where: {
					userId: otherUser.id
				},
				data: {
					lobby: gameId
				}
			});
			return (true);
		}
		return (false);*/
		}
		return "";
	}
}
