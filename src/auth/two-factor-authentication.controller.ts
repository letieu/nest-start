import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  HttpCode,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDecorator } from './decorators/user.decorator';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { ApiBearerAuth, ApiProduces, ApiTags } from '@nestjs/swagger';
import { TwoFactorAuthenticationCodeDto } from '../collection/user/dto/two-factor-auth-code.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth/2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly authService: AuthService,
  ) {}

  @ApiBearerAuth()
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  @ApiProduces('image/png')
  async generate(
    @Res() response: Response,
    @UserDecorator() user: JwtPayloadInterface,
  ) {
    const { otpAuthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        user,
      );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpAuthUrl,
    );
  }

  @Post('turn-on')
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @UserDecorator() user: JwtPayloadInterface,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      await this.twoFactorAuthenticationService.is2FaCodeValid(
        twoFactorAuthenticationCode,
        user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return this.twoFactorAuthenticationService.turnOnTwoFactorAuthentication(
      user.id,
    );
  }

  @Post('authenticate')
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @UserDecorator() user: JwtPayloadInterface,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthenticationService.is2FaCodeValid(
      twoFactorAuthenticationCode,
      user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    return this.authService.loginBy2FA(user.id);
  }
}
