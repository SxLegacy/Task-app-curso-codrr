import { IsNotEmpty, IsString } from "class-validator";
import { AuthBody } from "../interfaces/auth.interface";
import { ApiProperty } from "@nestjs/swagger";

export class AuthDTO implements AuthBody {
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}