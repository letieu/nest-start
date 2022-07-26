import { Entity, Column, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from '../../../database/base.entity';
import { Role, User } from './user.entity';

export enum OtpType {
  LOGIN = 'login',
  FORGOT_PASSWORD = 'forgot-password',
}

@Entity()
export class Otp extends BaseModel {
  @Column({ unique: true })
  @OneToOne(() => User)
  user: number;

  @Column()
  @Exclude()
  otp: string;

  @Column({
    type: 'enum',
    enum: OtpType,
  })
  type: OtpType;
}
