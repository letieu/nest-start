import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../collection/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '../../collection/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcryptjs';
import { mockedConfigService } from './mocks/config.mock';
import { mockedJwtService } from './mocks/jwt.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { usersRepository } from './mocks/user-repository.mock';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When validate credentials', () => {
    it('should validate username password', async () => {
      const user = await service.validateLoginByPassword('user1', 'secret');
      expect(user).toBeDefined();
      expect(user.username).toBe('user1');
    });

    describe('When user does not exist', () => {
      beforeEach(() => {
        usersRepository.findOne.mockResolvedValue(null);
      });

      it('should throw error if not found user', async () => {
        const promise = service.validateLoginByPassword('user2', 'secret');
        await expect(promise).rejects.toThrow('Invalid credentials');
      });
    });

    it('should throw error if password is wrong', async () => {
      const promise = service.validateLoginByPassword('user1', 'wrong');
      await expect(promise).rejects.toThrow('Invalid credentials');
    });
  });

  describe('When login', () => {
    beforeEach(() => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        role: Role.User,
      });
    });
    it('should create token', async () => {
      const { access_token } = await service.login('user1');
      expect(access_token).toBeDefined();
      expect(access_token).toBe('jwt-token');
    });
  });

  describe('When register', () => {
    describe('When user create by no auth user', () => {
      const newUser = {
        password: 'secret',
        username: 'user2',
        email: 'test@g.com',
      };
      beforeEach(() => {
        usersRepository.save.mockResolvedValue({
          ...newUser,
          id: 2,
          registerBy: null,
          role: Role.User,
        });
      });

      it('should create user', async () => {
        const user = await service.register(newUser, null);
        expect(user).toBeDefined();
        expect(user.username).toBe('user2');
        expect(user.role).toBe(Role.User);
        expect(user.registerBy).toBeNull();
      });

      it('should only create user role User', async () => {
        const user1 = await service.register(newUser, null);
        expect(usersRepository.save).toHaveBeenCalledWith(
          expect.not.objectContaining({ role: Role.Admin }),
        );
        expect(user1.role).toBe(Role.User);
        const user2 = await service.register(
          { ...newUser, role: Role.Admin },
          null,
        );
        expect(usersRepository.save).toHaveBeenCalledWith(
          expect.not.objectContaining({ role: Role.Admin }),
        );
        expect(user2.role).toBe(Role.User);
      });

      it('should hash password', async () => {
        await service.register(newUser, null);
        const savedUser = await usersRepository.save.mock.calls[0][0];
        expect(savedUser.password).not.toBe(newUser.password);
        await expect(
          compare(newUser.password, savedUser.password),
        ).resolves.toBeTruthy();
      });

      it('should hash different password', async () => {
        await service.register(newUser, null);
        const savedUser1 = await usersRepository.save.mock.calls[0][0];
        await service.register(newUser, null);
        const savedUser2 = await usersRepository.save.mock.calls[1][0];
        expect(savedUser1.password).not.toBe(savedUser2.password);
      });
    });

    describe('When user create by auth user', () => {
      const newUser = {
        password: 'secret',
        username: 'user2',
        email: 'test@g.com',
      };
      const authUser: JwtPayloadInterface = {
        role: Role.Admin,
        id: 1,
      };
      beforeEach(() => {
        usersRepository.save.mockResolvedValue({
          ...newUser,
          id: 2,
          registerBy: 1,
        });
      });
      it('should create user role User', async () => {
        await service.register(
          { ...newUser, role: Role.User },
          authUser,
        );
        expect(usersRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({ role: Role.User, registerBy: 1 }),
        );
      });
      it('should create user role Admin', async () => {
        await service.register(
          { ...newUser, role: Role.Admin },
          authUser,
        );
        expect(usersRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({ role: Role.Admin, registerBy: 1 }),
        );
      });
    });
  });
});
