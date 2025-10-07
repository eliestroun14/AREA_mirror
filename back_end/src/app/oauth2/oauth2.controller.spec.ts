import { Test, TestingModule } from '@nestjs/testing';
import { Oauth2Controller } from './oauth2.controller';
import { Oauth2Service } from './oauth2.service';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { InternalServerErrorException } from '@nestjs/common';
import UnauthenticatedException from '@errors/unauthenticated';
import { envConstants } from '@config/env';

describe('Oauth2Controller', () => {
  let controller: Oauth2Controller;
  let connectionService: ConnectionsService;

  const mockOauth2Service = {};
  const mockConnectionsService = {
    createConnection: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Oauth2Controller],
      providers: [
        { provide: Oauth2Service, useValue: mockOauth2Service },
        { provide: ConnectionsService, useValue: mockConnectionsService },
      ],
    }).compile();

    controller = module.get<Oauth2Controller>(Oauth2Controller);
    connectionService = module.get<ConnectionsService>(ConnectionsService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('gmailAuth should exist', () => {
    expect(controller.gmailAuth).toBeDefined();
  });

  it('discordAuth should exist', () => {
    expect(controller.discordAuth).toBeDefined();
  });

  it('githubAuth should exist', () => {
    expect(controller.githubAuth).toBeDefined();
  });

  describe('gmailAuthRedirect', () => {
    it('should create Gmail connection and redirect to success page', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        provider: {
          connection_name: 'Gmail',
          account_identifier: 'google-123',
          email: 'test@gmail.com',
          username: 'testuser',
          access_token: 'token',
          refresh_token: 'refresh',
        },
      } as any;

      const mockResponse = {
        redirect: jest.fn(),
      } as any;

      mockConnectionsService.createConnection.mockResolvedValue({});

      await controller.gmailAuthRedirect(mockRequest, mockResponse);

      expect(mockConnectionsService.createConnection).toHaveBeenCalledWith(
        'Gmail',
        'user-123',
        mockRequest.provider,
      );
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        envConstants.web_oauth2_success_redirect_url,
      );
    });

    it('should throw UnauthenticatedException if user is not present', async () => {
      const mockRequest = { provider: {} } as any;
      const mockResponse = { redirect: jest.fn() } as any;

      await expect(
        controller.gmailAuthRedirect(mockRequest, mockResponse),
      ).rejects.toThrow(UnauthenticatedException);
    });
  });

  describe('discordAuthRedirect', () => {
    it('should create Discord connection and redirect to success page', async () => {
      const mockRequest = {
        user: { userId: 'user-456' },
        provider: {
          connection_name: 'Discord',
          account_identifier: 'discord-123',
          email: 'test@discord.com',
          username: 'discorduser',
          access_token: 'token',
          refresh_token: 'refresh',
        },
      } as any;

      const mockResponse = {
        redirect: jest.fn(),
      } as any;

      mockConnectionsService.createConnection.mockResolvedValue({});

      await controller.discordAuthRedirect(mockRequest, mockResponse);

      expect(mockConnectionsService.createConnection).toHaveBeenCalledWith(
        'Discord',
        'user-456',
        mockRequest.provider,
      );
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        envConstants.web_oauth2_success_redirect_url,
      );
    });

    it('should throw UnauthenticatedException if user is not present', async () => {
      const mockRequest = { provider: {} } as any;
      const mockResponse = { redirect: jest.fn() } as any;

      await expect(
        controller.discordAuthRedirect(mockRequest, mockResponse),
      ).rejects.toThrow(UnauthenticatedException);
    });

    it('should throw InternalServerErrorException if provider is not present', async () => {
      const mockRequest = {
        user: { userId: 'user-456' },
        provider: null,
      } as any;
      const mockResponse = { redirect: jest.fn() } as any;

      await expect(
        controller.discordAuthRedirect(mockRequest, mockResponse),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('githubAuthRedirect', () => {
    it('should create GitHub connection and redirect to success page', async () => {
      const mockRequest = {
        user: { userId: 'user-789' },
        provider: {
          connection_name: 'Github',
          account_identifier: 'github-123',
          email: 'test@github.com',
          username: 'githubuser',
          access_token: 'token',
          refresh_token: 'refresh',
        },
      } as any;

      const mockResponse = {
        redirect: jest.fn(),
      } as any;

      mockConnectionsService.createConnection.mockResolvedValue({});

      await controller.githubAuthRedirect(mockRequest, mockResponse);

      expect(mockConnectionsService.createConnection).toHaveBeenCalledWith(
        'Github',
        'user-789',
        mockRequest.provider,
      );
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        envConstants.web_oauth2_success_redirect_url,
      );
    });

    it('should throw UnauthenticatedException if user is not present', async () => {
      const mockRequest = { provider: {} } as any;
      const mockResponse = { redirect: jest.fn() } as any;

      await expect(
        controller.githubAuthRedirect(mockRequest, mockResponse),
      ).rejects.toThrow(UnauthenticatedException);
    });

    it('should throw InternalServerErrorException if provider is not present', async () => {
      const mockRequest = {
        user: { userId: 'user-789' },
        provider: null,
      } as any;
      const mockResponse = { redirect: jest.fn() } as any;

      await expect(
        controller.githubAuthRedirect(mockRequest, mockResponse),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
