import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../collection/user/user.service';
import { RegisterUserDto } from '../collection/user/dto/register-user.dto';
import { User } from '../collection/user/entities/user.entity';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateLoginByPassword(
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.userService.findByUsernameOrEmail(username);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async validateLoginByOtp(email: string, otp: string): Promise<any> {
    const user = await this.userService.findByUsernameOrEmail(email);
    if (!user) {
      throw new HttpException('Invalid email', HttpStatus.UNAUTHORIZED);
    }
    const userOtp = await this.userService.getOtp(user.id);
    if (!userOtp) {
      throw new HttpException('Otp not found', HttpStatus.UNAUTHORIZED);
    }
    if (userOtp.createdAt.getTime() + 1000 * 60 * 5 < Date.now()) {
      throw new HttpException('Otp expired', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await compare(otp, userOtp.otp);
    if (!isMatch) {
      throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(username: string) {
    const user = await this.userService.findByUsernameOrEmail(username);
    const payload: JwtPayloadInterface = {
      id: user.id,
      role: user.role,
      is2FA: false,
    };
    return {
      access_token: this.jwtService.sign(payload),
      is2FAEnabled: user.is2FAEnabled,
    };
  }

  async loginBy2FA(userId) {
    const user = await this.userService.findOne({ id: userId });
    const payload: JwtPayloadInterface = {
      id: user.id,
      role: user.role,
      is2FA: true,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    userDto: RegisterUserDto,
    authUser: JwtPayloadInterface | null,
  ): Promise<User> {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      displayName,
      role,
    } = userDto;

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.displayName = displayName;
    newUser.is2FAEnabled = false;
    if (authUser) {
      newUser.registerBy = authUser.id;
      newUser.role = role;
    }

    const salt = await genSalt(10);

    newUser.password = await hash(password, salt);

    return await this.userService.create(newUser);
  }

  async requestOtp(email: string) {
    let user = await this.userService.findOne({ email });
    if (!user) {
      user = await this.userService.create({ email, username: email });
    }
    return this.userService.createOtp(user.id);
  }
}
