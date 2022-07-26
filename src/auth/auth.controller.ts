import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from '../collection/user/dto/register-user.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../collection/user/dto/login-user.dto';
import { UserDecorator } from './decorators/user.decorator';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { Role, User } from '../collection/user/entities/user.entity';
import { RoleGuard } from './guards/role.guard';
import { LoginEmailDto } from '../collection/user/dto/login-email.dto';
import { EmailAuthGuard } from './guards/email-auth.guard';
import { RequestOtpDto } from '../collection/user/dto/request-otp.dto';
import { Jwt2faAuthGuard } from "./guards/jwt-2fa-auth.guard";

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login-password')
  async loginByPassword(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto.username);
  }

  @UseGuards(EmailAuthGuard)
  @Post('login-email')
  async loginByEmail(@Body() loginDto: LoginEmailDto) {
    return this.authService.login(loginDto.email);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto, null);
  }

  @UseGuards(RoleGuard([Role.Admin]))
  @ApiBearerAuth()
  @Post('create')
  async create(
    @Body() registerDto: RegisterUserDto,
    @UserDecorator() user: JwtPayloadInterface,
  ) {
    return this.authService.register(registerDto, user);
  }

  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.authService.requestOtp(requestOtpDto.email);
  }

  @ApiBearerAuth()
  @UseGuards(Jwt2faAuthGuard)
  @Get('me')
  async me(@UserDecorator() user: User) {
    return user;
  }
}
