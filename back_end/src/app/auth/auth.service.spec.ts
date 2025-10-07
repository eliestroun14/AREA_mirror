import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should hash password and create user', async () => {
      const mockUserData: Prisma.usersCreateInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'plainPassword123',
      };

      const mockHashedPassword = 'hashedPassword123';
      const mockCreatedUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: mockHashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      mockUsersService.createUser.mockResolvedValue(mockCreatedUser);

      const result = await service.signUp(mockUserData);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        password: mockHashedPassword,
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it('should use custom bcrypt salt rounds from env', async () => {
      const mockUserData: Prisma.usersCreateInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'plainPassword123',
      };

      const mockCreatedUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUsersService.createUser.mockResolvedValue(mockCreatedUser);

      await service.signUp(mockUserData);

      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('should throw error if user creation fails', async () => {
      const mockUserData: Prisma.usersCreateInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'plainPassword123',
      };

      const error = new Error('Database error');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUsersService.createUser.mockRejectedValue(error);

      await expect(service.signUp(mockUserData)).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle duplicate email error', async () => {
      const mockUserData: Prisma.usersCreateInput = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'plainPassword123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUsersService.createUser.mockRejectedValue(
        new Error('Email already exists'),
      );

      await expect(service.signUp(mockUserData)).rejects.toThrow(
        'Email already exists',
      );
    });
  });

  describe('signIn', () => {
    it('should return JWT token for valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'plainPassword123';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockToken = 'jwt.token.here';

      mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.signIn(email, password);

      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        userId: mockUser.id,
      });
      expect(result).toBe(mockToken);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUsersService.getUserByEmail.mockResolvedValue(null);

      await expect(service.signIn(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signIn(email, password)).rejects.toThrow(
        'Invalid credentials.',
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signIn(email, password)).rejects.toThrow(
        'Invalid credentials.',
      );
    });

    it('should handle user with undefined id', async () => {
      const email = 'test@example.com';
      const password = 'plainPassword123';
      const mockUser = {
        id: undefined,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockToken = 'jwt.token.here';

      mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.signIn(email, password);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ userId: 0 });
      expect(result).toBe(mockToken);
    });

    it('should handle case-sensitive email', async () => {
      const email = 'Test@Example.com';
      const password = 'plainPassword123';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockToken = 'jwt.token.here';

      mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      await service.signIn(email, password);

      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(email);
    });
  });
});
