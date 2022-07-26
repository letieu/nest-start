import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from '../collection/user/user.service';
import { ConfigService } from '@nestjs/config';
import { toFileStream } from 'qrcode';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async generateTwoFactorAuthenticationSecret(
    jwtPayloadInterface: JwtPayloadInterface,
  ) {
    const secret = authenticator.generateSecret();
    const user = await this.userService.findOne({ id: jwtPayloadInterface.id });

    const otpAuthUrl = authenticator.keyuri(
      user.username,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );

    await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpAuthUrl,
    };
  }
  public async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  public async is2FaCodeValid(
    twoFactorAuthenticationCode: string,
    jwtPayloadInterface: JwtPayloadInterface,
  ) {
    const user = await this.userService.findOne({ id: jwtPayloadInterface.id });
    if (!user.twoFactorAuthSecret) {
      throw new HttpException(
        '2FA code is not generated',
        HttpStatus.BAD_REQUEST,
      );
    }
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthSecret,
    });
  }

  public async turnOnTwoFactorAuthentication(userId: number) {
    return this.userService.update(userId, {
      is2FAEnabled: true,
    });
  }
}
