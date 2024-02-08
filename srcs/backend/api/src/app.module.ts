import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ChatModule } from "./chat/chat.module";
import { GameModule } from "./game/game.module";
import { StatusModule } from "./status/status.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
	imports: [
		AuthModule,
		UserModule,
		PrismaModule,
		ChatModule,
		StatusModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "..", "images"),
			serveRoot: "/images"
		}),
		GameModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
