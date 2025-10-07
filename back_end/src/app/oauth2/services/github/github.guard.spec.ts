import { GithubOAuthGuard } from './github.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { GithubProvider } from './github.dto';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';

describe('GithubOAuthGuard', () => {
  let guard: GithubOAuthGuard;

  beforeEach(() => {
    guard = new GithubOAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with github strategy', () => {
    expect(guard).toBeInstanceOf(GithubOAuthGuard);
  });

  describe('getAuthenticateOptions', () => {
    it('should return state with JWT token from query', () => {
      const mockRequest = {
        query: {
          token: 'jwt-token-123',
        },
      } as unknown as Request;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      const result = guard.getAuthenticateOptions(mockContext);

      expect(result).toEqual({
        state: 'jwt-token-123',
      });
    });

    it('should return empty object when token is undefined', () => {
      const mockRequest = {
        query: {},
      } as unknown as Request;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      const result = guard.getAuthenticateOptions(mockContext);

      expect(result).toEqual({});
    });

    it('should return empty object when query is missing', () => {
      const mockRequest = {
        query: {},
      } as unknown as Request;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      const result = guard.getAuthenticateOptions(mockContext);

      expect(result).toEqual({});
    });

    it('should handle empty token string', () => {
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

      const result = guard.getAuthenticateOptions(mockContext);

      expect(result).toEqual({});
    });
  });

  describe('handleRequest', () => {
    it('should attach provider to request and return user', () => {
      const mockGithubProvider: GithubProvider = {
        connection_name: 'Github',
        account_identifier: 'github-user-123',
        email: 'test@github.com',
        username: 'testuser',
        picture: 'https://example.com/photo.jpg',
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        expires_at: null,
        scopes: ['user', 'repo'],
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
        mockGithubProvider,
        null,
        mockContext,
      );

      expect(mockRequest.provider).toBe(mockGithubProvider);
      expect(result).toBe(mockJwtPayload);
    });

    it('should handle request without existing user', () => {
      const mockGithubProvider: GithubProvider = {
        connection_name: 'Github',
        account_identifier: 'github-user-456',
        email: 'test2@github.com',
        username: 'testuser2',
        picture: 'https://example.com/photo2.jpg',
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        access_token: 'access_token_2',
        refresh_token: 'refresh_token_2',
        expires_at: null,
        scopes: ['user', 'repo'],
      };

      const mockRequest = {} as any;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      const result = guard.handleRequest(
        null,
        mockGithubProvider,
        null,
        mockContext,
      );

      expect(mockRequest.provider).toBe(mockGithubProvider);
      expect(result).toBeUndefined();
    });

    it('should attach provider even when user is undefined', () => {
      const mockGithubProvider: GithubProvider = {
        connection_name: 'Github',
        account_identifier: 'github-user-789',
        email: 'test3@github.com',
        username: 'testuser3',
        picture: 'https://example.com/photo3.jpg',
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        access_token: 'access_token_3',
        refresh_token: 'refresh_token_3',
        expires_at: null,
        scopes: ['user', 'repo'],
      };

      const mockRequest = {
        user: undefined,
      } as any;

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      guard.handleRequest(null, mockGithubProvider, null, mockContext);

      expect(mockRequest.provider).toBe(mockGithubProvider);
    });
  });
});
