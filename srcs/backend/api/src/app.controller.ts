import { Controller, Get, Param } from "@nestjs/common";
import { AppService } from "./app.service";
import { User } from "@prisma/client";
import path from "path";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): Promise<string> {
		return this.appService.getHello();
	}
}
