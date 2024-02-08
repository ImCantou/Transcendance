import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { UserService } from "src/user/user.service";

@Module({
	imports: [ConfigModule.forRoot(), HttpModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, UserService]
})
export class AuthModule {}
