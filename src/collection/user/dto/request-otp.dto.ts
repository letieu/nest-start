import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../entities/user.entity';

export class RequestOtpDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
