import {
	Controller,
	Post,
	Get,
	UseGuards,
	Patch,
	Body,
	UnauthorizedException
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { GetUser } from "src/auth/decorator";
import { Channel, User } from "@prisma/client";
import { JwtGuard } from "src/auth/guard";
import {
	ChannelAllInfo,
	ChannelBan,
	ChannelChangement,
	ChannelCreation,
	ChannelJoin,
	ChannelKick,
	ChannelMute,
	ListChannel,
	MessageWrite
} from "./dto/chat";
import UserDatabase from "./database/user";

@UseGuards(JwtGuard)
@Controller("chat")
export class ChatController {
	constructor(private ChatService: ChatService, private User: UserDatabase) {}

	// Get all the information about himself
	@Get("getData")
	async getData(@GetUser() user: User): Promise<ListChannel> {
		return await this.ChatService.getData(user);
	}

	// To send a message
	@Post("message")
	async message(@GetUser() user: User, @Body() message: MessageWrite) {
		message.authorId = user.id;
		const error: string = await this.ChatService.message(user, message);
		if (error.length > 0) throw new UnauthorizedException(error);
	}

	// Create a new channel
	@Post("/channel/create")
	async create(@GetUser() user: User, @Body() channel: ChannelCreation) {
		return await this.ChatService.createChannel(user, channel);
	}

	// Get list of channels
	@Get("/channel/public")
	async public(@GetUser() user: User) {
		return await this.ChatService.publicChannel(user);
	}

	@Get("/channel/protected")
	async protected(@GetUser() user: User) {
		return await this.ChatService.protectedChannel(user);
	}

	// Join an existing channel
	@Post("/channel/join")
	async join(@GetUser() user: User, @Body() channel: ChannelJoin) {
		return await this.ChatService.joinChannel(user, channel);
	}

	@Patch("/channel/quit")
	async quit(@GetUser() user: User, @Body() channel: { id: string }) {
		return await this.ChatService.quitChannel(user, channel);
	}

	@Patch("/channel/list")
	async list(
		@GetUser() user: User,
		@Body() body: { channelId: string }
	): Promise<
		{
			isAdmin: boolean;
			mute: boolean;
			muteEnd: Date;
			user: { id: number; name: string; image: string };
			channel: { ownerId: number };
		}[]
	> {
		return await this.ChatService.listUser(user, body.channelId);
	}

	@Patch("/channel/list/ban")
	async listBan(
		@GetUser() user: User,
		@Body() body: { channelId: string }
	): Promise<
		{
			id: string;
			user: { id: number; name: string; image: string };
		}[]
	> {
		return await this.ChatService.listBan(user, body.channelId);
	}

	@Patch("/channel/get")
	async getChannel(
		@GetUser() user: User,
		@Body() channel: { id: string }
	): Promise<ChannelAllInfo> {
		const res: Channel = await this.ChatService.getChannelInfo(
			user,
			channel.id
		);
		if (res != null)
			return await {
				id: res.id,
				createdAt: res.createdAt,
				updateAt: res.updateAt,
				name: res.name,
				avatar: res.avatar,
				description: res.description,
				status: res.status,
				messagesId: res.messagesId
			};
		return await res;
	}

	@Patch("/channel/settings")
	async settings(@GetUser() user: User, @Body() body: ChannelChangement) {
		await this.ChatService.channelChangement(user, body);
	}

	@Patch("/channel/delete")
	async delete(@GetUser() user: User, @Body() body: { id: string }) {
		await this.ChatService.deleteChannel(user, body);
	}

	@Patch("/channel/kick")
	async kick(@GetUser() user: User, @Body() body: ChannelKick) {
		await this.ChatService.kick(user, body);
	}

	@Patch("/channel/ban")
	async ban(@GetUser() user: User, @Body() body: ChannelBan) {
		await this.ChatService.ban(user, body);
	}

	@Patch("/channel/unban")
	async unban(
		@GetUser() user: User,
		@Body() body: { id: string; channelId: string }
	) {
		await this.ChatService.unban(user, body);
	}

	@Patch("/channel/mute")
	async mute(@GetUser() user: User, @Body() body: ChannelMute) {
		await this.ChatService.mute(user, body);
	}

	@Patch("/channel/unmute")
	async unmute(@GetUser() user: User, @Body() body: ChannelMute) {
		await this.ChatService.unmute(user, body);
	}

	@Post("/channel/direct")
	async direct_message(@GetUser() user: User, @Body() body: { id: string }) {
		await this.ChatService.createDirect(user, [user.id, Number(body.id)]);
	}

	@Post("/channel/direct/other")
	async get_other_info(
		@GetUser() user: User,
		@Body() body: { id: string }
	): Promise<{ name: string; image: string }> {
		const oUser: User = await this.ChatService.getOtherInfo(
			user.id,
			body.id
		);
		return await { name: oUser.name, image: oUser.image };
	}

	@Post("/channel/owner")
	async isOwner(
		@GetUser() user: User,
		@Body() body: { id: string; other: string }
	): Promise<boolean> {
		return await this.User.isOwner(user.id, body.id);
	}

	@Post("/channel/modo")
	async isModo(
		@GetUser() user: User,
		@Body() body: { id: string }
	): Promise<boolean> {
		return await this.User.isModo(user.id, body.id);
	}

	@Post("/channel/modo/change")
	async changeModo(
		@GetUser() user: User,
		@Body() body: { userId: number; channelId: string }
	) {
		await this.ChatService.changeModo(user, body);
	}

	@Post("/fight")
	async Fight(
		@GetUser() user: User,
		@Body() body: { id: string }
	): Promise<{ gameId: string }> {
		const msg = await this.ChatService.fight(user, body.id);
		if (msg == "") {
			return { gameId: undefined };
		} else {
			this.ChatService.message(user, {
				channelId: body.id,
				authorId: user.id,
				content: "Come here for the fight",
				link: "/play?gameId=" + msg
			});
			return { gameId: msg };
		}
	}
}
