import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../collection/user/user.service';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_KEY'),
    });
  }

  async validate(payload: JwtPayloadInterface) {
    const user = await this.userService.findOne({ id: payload.id });
    if (!user.is2FAEnabled) {
      return user;
    }
    if (payload.is2FA) {
      return user;
    }
  }
}
