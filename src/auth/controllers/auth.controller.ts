import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDTO } from '../dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('login')
    async login(@Body() { username, password}: AuthDTO) {
        const userValidate = await this.authService.validateUser(
            username,
            //email,
            password,
        );

        if(!userValidate) {
            throw new UnauthorizedException('Data not valid. Please check');
        };

        const jwt = await this.authService.generateJWT(userValidate);

        return jwt;
    }
}
