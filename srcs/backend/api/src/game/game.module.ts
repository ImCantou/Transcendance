import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { LobbyManager } from './Lobby/LobbyManager';
import { ScheduleModule } from '@nestjs/schedule';
import { GameService } from './game.service';

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [GameService, GameGateway, LobbyManager],
})
export class GameModule {}