import { DiscordOAuthGuard } from './discord.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { DiscordProvider } from './discord.dto';
import { CryptoService } from '../../crypto/crypto.service';

describe('DiscordOAuthGuard', () => {
  let guard: DiscordOAuthGuard;
  let mockCryptoService: CryptoService;

  beforeEach(() => {
    mockCryptoService = {
      encryptJWT: jest.fn(() => 'encrypted_token'),
      decryptJWT: jest.fn(() => ({ jwt: 'real_jwt_token', platform: 'web' })),
    } as unknown as CryptoService;

    guard = new DiscordOAuthGuard(mockCryptoService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with discord strategy', () => {
    expect(guard).toBeInstanceOf(DiscordOAuthGuard);
  });

  describe('getAuthenticateOptions', () => {
    it('should decrypt token and return state with encrypted callback token', () => {
      const mockRequest = {
        query: {
          token: 'encrypted_token_123',
        },
      } as unknown as Request;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      (mockCryptoService.decryptJWT as jest.Mock).mockReturnValue({
        jwt: 'real_jwt_token',
        platform: 'web',
      });

      (mockCryptoService.encryptJWT as jest.Mock).mockReturnValue('new_encrypted_token');

      const result = guard.getAuthenticateOptions(mockContext);

      expect(mockCryptoService.decryptJWT).toHaveBeenCalledWith('encrypted_token_123');
      expect(mockCryptoService.encryptJWT).toHaveBeenCalledWith('real_jwt_token', 'web');
      expect(result).toEqual({
        state: 'new_encrypted_token',
      });
      expect(mockRequest['oauth_jwt']).toBe('real_jwt_token');
    });

    it('should throw UnauthorizedException when token is missing', () => {
      const mockRequest = {
        query: {},
      } as unknown as Request;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      expect(() => guard.getAuthenticateOptions(mockContext)).toThrow(
        UnauthorizedException,
      );
      expect(() => guard.getAuthenticateOptions(mockContext)).toThrow(
        'Encrypted token required',
      );
    });

    it('should throw UnauthorizedException when token is invalid', () => {
      const mockRequest = {
        query: {
          token: 'invalid_token',
        },
      } as unknown as Request;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      (mockCryptoService.decryptJWT as jest.Mock).mockReturnValue(null);

      expect(() => guard.getAuthenticateOptions(mockContext)).toThrow(
        UnauthorizedException,
      );
      expect(() => guard.getAuthenticateOptions(mockContext)).toThrow(
        'Invalid or expired encrypted token',
      );
    });

    it('should throw UnauthorizedException when token is empty string', () => {
      const mockRequest = {
        query: {
          token: '',
        },
      } as unknown as Request;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      expect(() => guard.getAuthenticateOptions(mockContext)).toThrow(
        UnauthorizedException,
      );
    });

    it('should handle token without platform', () => {
      const mockRequest = {
        query: {
          token: 'encrypted_token_456',
        },
      } as unknown as Request;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      (mockCryptoService.decryptJWT as jest.Mock).mockReturnValue({
        jwt: 'jwt_without_platform',
        platform: undefined,
      });

      (mockCryptoService.encryptJWT as jest.Mock).mockReturnValue('callback_token');

      const result = guard.getAuthenticateOptions(mockContext);

      expect(mockCryptoService.encryptJWT).toHaveBeenCalledWith(
        'jwt_without_platform',
        undefined,
      );
      expect(result.state).toBe('callback_token');
    });
  });

  describe('handleRequest', () => {
    it('should attach provider to request and return user', () => {
      const mockDiscordProvider: DiscordProvider = {
        connection_name: 'Discord',
        account_identifier: 'discord-user-123',
        email: 'test@discord.com',
        username: 'testuser',
        picture: 'https://example.com/photo.jpg',
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        expires_at: null,
        scopes: ['identify', 'email'],
      };

      const mockJwtPayload = {
        sub: 'user-123',
        email: 'user@example.com',
      };

      const mockRequest = {
        user: mockJwtPayload,
      } as any;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      const result = guard.handleRequest(
        null,
        mockDiscordProvider,
        null,
        mockContext,
      );

      expect(mockRequest.provider).toBe(mockDiscordProvider);
      expect(result).toBe(mockJwtPayload);
    });

    it('should handle request without existing user', () => {
      const mockDiscordProvider: DiscordProvider = {
        connection_name: 'Discord',
        account_identifier: 'discord-user-456',
        email: 'test2@discord.com',
        username: 'testuser2',
        picture: 'https://example.com/photo2.jpg',
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        access_token: 'access_token_2',
        refresh_token: 'refresh_token_2',
        expires_at: null,
        scopes: ['identify', 'email'],
      };

      const mockRequest = {} as any;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      const result = guard.handleRequest(
        null,
        mockDiscordProvider,
        null,
        mockContext,
      );

      expect(mockRequest.provider).toBe(mockDiscordProvider);
      expect(result).toBeUndefined();
    });

    it('should attach provider even when user is undefined', () => {
      const mockDiscordProvider: DiscordProvider = {
        connection_name: 'Discord',
        account_identifier: 'discord-user-789',
        email: 'test3@discord.com',
        username: 'testuser3',
        picture: 'https://example.com/photo3.jpg',
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        access_token: 'access_token_3',
        refresh_token: 'refresh_token_3',
        expires_at: null,
        scopes: ['identify', 'email'],
      };

      const mockRequest = {
        user: undefined,
      } as any;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      guard.handleRequest(null, mockDiscordProvider, null, mockContext);

      expect(mockRequest.provider).toBe(mockDiscordProvider);
    });
  });
});
