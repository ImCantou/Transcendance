import {
	Patch,
	Controller,
	Get,
	UseGuards,
	Body,
	Query,
	Post
} from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { UserService } from "./user.service";
import { UserSafeDTO } from "./dto";

@UseGuards(JwtGuard)
@Controller("user")
export class UserController {
	constructor(private userService: UserService) {}
	@Get("me")
	getMe(@GetUser() user: User): UserSafeDTO {
		return this.userService.getUserSafe(user);
	}

	@Get("trueMe")
	getTrueMe(@GetUser() user: User): Promise<User> {
		return this.userService.getTrueUser(user);
	}

	@Patch("update/image")
	async updateImage(
		@GetUser() user: User,
		@Body() body
	): Promise<{ image: string }> {
		return await this.userService.updateUserImage(
			user,
			body.imageType,
			body.base64Data
		);
	}

	@Patch("update/name")
	async updateName(
		@GetUser() user: User,
		@Body() body
	): Promise<{ name: string }> {
		return this.userService.updateUserName(user, body.name);
	}

	@Patch("signup")
	async signup(@GetUser() user: User): Promise<{ signUp: Boolean }> {
		return this.userService.signUp(user);
	}

	@Get("find")
	async findUser(@Query("username") username: string): Promise<UserSafeDTO> {
		return this.userService.findUser(username);
	}

	@Post("block")
	async blockUser(@GetUser() user: User,
	                @Body() body):
					Promise<{ name: string}> {
		return this.userService.blockUser(user, body.username);
	}

	@Post("unblock")
	async unblockUser(@GetUser() user: User,
	                @Body() body):
					Promise<{ name: string}> {
		return this.userService.unblockUser(user, body.username);
	}

	@Get("getBlocked")
	async getBlockedUsers(@GetUser() user: User): Promise<{friends: Array<User>}> {
		return this.userService.getBlockedUsers(user);   
	}

	@Post("friends/add")
	async addFriend(
		@GetUser() user: User,
		@Body() body
	): Promise<{ name: string }> {
		return this.userService.addFriend(user, body.username);
	}

	@Get("friends/get")
	async getFriends(@GetUser() user: User): Promise<{ friends: Array<User> }> {
		return this.userService.getFriends(user);   
	}

	@Get("friends/getPending")
	async getPendingFriends(
		@GetUser() user: User
	): Promise<{ friends: Array<User> }> {
		return this.userService.getPendingFriends(user);   
	}

	@Post("friends/accept")
	async acceptFriend(
		@GetUser() user: User,
		@Body() body
	): Promise<{ name: string }> {
		return this.userService.acceptFriend(user, body.username);
	}

	@Post("friends/decline")
	async declineFriend(
		@GetUser() user: User,
		@Body() body
	): Promise<{ name: string }> {
		return this.userService.declineFriend(user, body.username);
	}

	@Post("friends/delete")
	async deleteFriend(
		@GetUser() user: User,
		@Body() body
	): Promise<{ name: string }> {
		return this.userService.deleteFriend(user, body.username);
	}

	@Get("leaderboard/firsts")
	async getLeaderboardFirsts(@GetUser() user: User): Promise<{leaderboard: Array<User>}> {
		return this.userService.getLeaderboardFirsts(user);   
	}

	@Get("leaderboard/others")
	async getLeaderboardOthers(@GetUser() user: User): Promise<{leaderboard: Array<User>}> {
		return this.userService.getLeaderboardOthers(user);   
	}

}
