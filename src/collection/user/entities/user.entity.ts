import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from '../../../database/base.entity';

export enum Role {
  User = 'User',
  Admin = 'Admin',
}

@Entity()
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  username?: string;

  @Column()
  email?: string;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ default: false })
  banned?: boolean;

  @Column({ nullable: true })
  @Exclude()
  twoFactorAuthSecret?: string;

  @Column({ default: false })
  is2FAEnabled?: boolean;

  @Column({ nullable: true })
  @OneToOne(() => User)
  registerBy?: number;

  @Column({ default: 0 })
  safeDrivingScore?: number;
}
