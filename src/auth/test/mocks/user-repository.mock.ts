import { Role } from '../../../collection/user/entities/user.entity';
import { genSalt, hash, compare } from 'bcryptjs';

async function hashPassword(password: string) {
  return await hash(password, await genSalt(10));
}

async function getUser() {
  return {
    id: 1,
    email: 'user1@email.com',
    username: 'user1',
    password: await hashPassword('secret'),
    firstName: 'User',
    lastName: 'One',
    displayName: 'User One',
    role: Role.User,
    banned: false,
    twoFactorAuthSecret: 'secret',
    is2FAEnabled: false,
    registerBy: 2,
  };
}

export const usersRepository = {
  findOne: jest.fn().mockResolvedValue(getUser()),
  save: jest.fn().mockResolvedValue(undefined),
};
