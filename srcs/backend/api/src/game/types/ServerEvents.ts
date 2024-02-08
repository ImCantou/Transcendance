export enum ServerEvents
{
  	// General
	Pong = 'server.pong',

	QueueJoined = 'server.queue.joined',

	QueueLeft = 'server.queue.left',
  	// Lobby
	LobbyState = 'server.lobby.state',

  	// Game
	GameMessage = 'server.game.message',

	//
	LobbyError = 'server.lobby.error', 

	PrivateJoined = 'server.private.join',

	PrivateLeft = 'server.private.left'
}