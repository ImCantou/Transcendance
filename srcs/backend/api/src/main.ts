import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { urlencoded, json } from "express";
import { WebSocketAdapter } from "./WebSocketAdapter/webSocketAdapter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true
		})
	);
	app.useWebSocketAdapter(new WebSocketAdapter(app));
	app.use(json({ limit: "1mb" }));
	app.use(urlencoded({ extended: true, limit: "1mb" }));
	await app.listen(3000);
}
bootstrap();
