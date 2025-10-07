import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInBody, SignUpBody } from './auth.dto';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user and return UserDTO', async () => {
      const signUpDto: SignUpBody = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'SecurePassword123!',
      };

      const mockUser = {
        id: 1,
        email: 'newuser@example.com',
        name: 'New User',
        password: 'hashedPassword',
        created_at: new Date('2025-01-01T00:00:00.000Z'),
        updated_at: new Date('2025-01-01T00:00:00.000Z'),
      };

      mockAuthService.signUp.mockResolvedValue(mockUser);

      const result = await controller.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual({
        id: 1,
        email: 'newuser@example.com',
        name: 'New User',
        created_at: 'Wed, 01 Jan 2025 00:00:00 GMT',
        updated_at: 'Wed, 01 Jan 2025 00:00:00 GMT',
      });
    });

    it('should format dates to UTC string', async () => {
      const signUpDto: SignUpBody = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      };

      const mockUser = {
        id: 2,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        created_at: new Date('2025-06-15T12:30:45.000Z'),
        updated_at: new Date('2025-06-15T12:30:45.000Z'),
      };

      mockAuthService.signUp.mockResolvedValue(mockUser);

      const result = await controller.signUp(signUpDto);

      expect(result.created_at).toBe('Sun, 15 Jun 2025 12:30:45 GMT');
      expect(result.updated_at).toBe('Sun, 15 Jun 2025 12:30:45 GMT');
    });

    it('should not return password in response', async () => {
      const signUpDto: SignUpBody = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockAuthService.signUp.mockResolvedValue(mockUser);

      const result = await controller.signUp(signUpDto);

      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if signup fails', async () => {
      const signUpDto: SignUpBody = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'Password123!',
      };

      mockAuthService.signUp.mockRejectedValue(
        new Error('Email already exists'),
      );

      await expect(controller.signUp(signUpDto)).rejects.toThrow(
        'Email already exists',
      );
    });
  });

  describe('signIn', () => {
    it('should sign in user and return token with cookie', async () => {
      const signInDto: SignInBody = {
        email: 'user@example.com',
        password: 'Password123!',
      };

      const mockToken = 'jwt.token.here';
      mockAuthService.signIn.mockResolvedValue(mockToken);

      const mockResponse = {
        cookie: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.signIn(signInDto, mockResponse);

      expect(authService.signIn).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'session_token',
        mockToken,
        {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        },
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        session_token: mockToken,
      });
    });

    it('should set secure cookie options', async () => {
      const signInDto: SignInBody = {
        email: 'user@example.com',
        password: 'Password123!',
      };

      const mockToken = 'jwt.token.here';
      mockAuthService.signIn.mockResolvedValue(mockToken);

      const mockResponse = {
        cookie: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.signIn(signInDto, mockResponse);

      const cookieCall = (mockResponse.cookie as jest.Mock).mock.calls[0];
      expect(cookieCall[2]).toEqual({
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    });

    it('should throw error if credentials are invalid', async () => {
      const signInDto: SignInBody = {
        email: 'user@example.com',
        password: 'WrongPassword',
      };

      mockAuthService.signIn.mockRejectedValue(
        new Error('Invalid credentials.'),
      );

      const mockResponse = {
        cookie: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await expect(controller.signIn(signInDto, mockResponse)).rejects.toThrow(
        'Invalid credentials.',
      );
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should handle empty token gracefully', async () => {
      const signInDto: SignInBody = {
        email: 'user@example.com',
        password: 'Password123!',
      };

      const mockToken = '';
      mockAuthService.signIn.mockResolvedValue(mockToken);

      const mockResponse = {
        cookie: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.signIn(signInDto, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'session_token',
        '',
        expect.any(Object),
      );
    });
  });
});
