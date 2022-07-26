import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-custom';

@Injectable()
export class EmailStrategy extends PassportStrategy(Strategy, 'email') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request) {
    const body = req.body as any;
    const user = await this.authService.validateLoginByOtp(
      body?.email,
      body?.otp,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
