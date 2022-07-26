import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { BaseService } from '../../database/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Otp, OtpType } from './entities/otp.entity';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {
    super(userRepository);
  }

  async findByUsernameOrEmail(username: string): Promise<User | undefined> {
    return await this.repository.findOne({
      where: [{ username }, { email: username }],
    });
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.repository.update(userId, {
      twoFactorAuthSecret: secret,
    });
  }

  async getOtp(userId: number) {
    return this.otpRepository.findOne({
      where: {
        user: userId,
      },
    });
  }

  async createOtp(userId: number, type = OtpType.LOGIN) {
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    console.log(otpCode);
    const salt = await genSalt(10);
    await this.otpRepository.delete({ user: userId });
    const otp = new Otp();
    otp.user = userId;
    otp.otp = await hash(otpCode.toString(), salt);
    otp.type = type;
    return this.otpRepository.save(otp);
  }

  async updateProfile(id, dto: UpdateUserDto) {
    return super.update(id, {
      displayName: dto.displayName,
      lastName: dto.lastName,
      firstName: dto.firstName,
    });
  }
}
