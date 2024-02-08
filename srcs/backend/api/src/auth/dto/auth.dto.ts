import { IsNotEmpty, IsString, isString } from "class-validator";

export class AuthDto {
	"code": string;
	"error": string;
}
