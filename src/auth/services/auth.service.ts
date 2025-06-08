import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';
import { PayloadToken } from '../interfaces/auth.interface';


@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  public async validateUser(username: string, password: string) {
    const userByUsername = await this.userService.findBy({
      key: 'username',
      value: username,
    });
    const userByEmail = await this.userService.findBy({
      key: 'email',
      value: username,
    });

    if (userByUsername) {
      const match = await bcrypt.compare(password, userByUsername.password);
      if (match) return userByUsername;
    }

    if (userByEmail) {
      const match = await bcrypt.compare(password, userByEmail.password);
      if (match) return userByEmail;
    }
  }

  public signJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: any;
  }) {
    // const options: jwt.SignOptions = {};
    // if (typeof expires === 'number') {
    //   options.expiresIn = expires;
    // } else if (typeof expires === 'string') {
    //   options.expiresIn = expires ; // return gemini
    // } 
    // return jwt.sign(payload, secret, options);
   
    return jwt.sign(payload, secret, { expiresIn : expires }); //return codrr
   
    // return jwt.sign(payload, secret, { expiresIn: '1h' }); //return de prueba
  }

  public async generateJWT(user: UsersEntity): Promise<any> {
    const getUser = await this.userService.findUserById(user.id);

    const payload: PayloadToken = {
        role: getUser.role,
        sub: getUser.id
    }

    return {
      accessToken: this.signJWT({
        payload,
        secret: process.env.JWT_SECRET,
        expires: '1h',
      }),
      user,
    };
  }
}
