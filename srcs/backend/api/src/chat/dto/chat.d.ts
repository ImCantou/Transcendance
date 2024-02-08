export type MessagePayload = {
	id: string;
	createdAt: Date;
	updateAt: Date;
	channelId: string;
	authorId: number;
	content: string;
	link: string | null;
};

export type DirectChannel = {
	id: string;
	name: string;
	status: Status;
	direct: boolean;
	Message: Message[];
};

export type ChannelAllInfo = {
	id: string;
	createdAt: Date;
	updateAt: Date;
	name: string;
	avatar: string | null;
	description: string;
	status: string;
	messagesId: number[];
};

export type MessageWrite = {
	channelId: string;
	authorId: number;
	content: string;
	link: string;
};

export type ChannelCreation = {
	name: string;
	status: status;
	password: string;
};

export type ChannelChangement = {
	id: string;
	name: string;
	description: string;
	status: string;
	password: string;
};

export type ChannelNewPassword = {
	id: string;
	password: string;
};

export type ChannelPayload = {
	id: string;
	name: string;
	status: string;
	direct: boolean;
	message: MessagePayload[];
};

export type ChannelInvitation = {
	id: string;
	invited: number;
};

export type ChannelQuit = ChannelInvitation;
export type ChannelKick = ChannelInvitation;
export type ChannelBan = ChannelInvitation;
export type ChannelMute = {
	id: string;
	muted: number;
	until: Date;
};

export type ChannelJoin = {
	id: string;
	password: string;
};

export type ListName = {
	name: string;
};

export type ChannelInfo = {
	id: string;
	name: string;
	status: string;
};

export type ListChannel = { [key: string]: ChannelPayload };

export enum Status {
	PROTECT,
	PRIVATE,
	PUBLIC
}

export type MessageSend = {
	id: string;
	createdAt: Date;
	updateAt: Date;
	channelId: string;
	authorId: number;
	username: string;
	avatar: string;
	content: string;
	link: string;
};
