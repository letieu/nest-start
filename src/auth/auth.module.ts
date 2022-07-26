import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../collection/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { Jwt2faStrategy } from './strategies/jwt2fa.strategy';
import { EmailStrategy } from "./strategies/email.strategy";

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRED_TIME') },
      }),
    }),
  ],
  providers: [
    AuthService,
    TwoFactorAuthenticationService,
    LocalStrategy,
    JwtStrategy,
    Jwt2faStrategy,
    EmailStrategy,
  ],
  controllers: [AuthController, TwoFactorAuthenticationController],
})
export class AuthModule {}
