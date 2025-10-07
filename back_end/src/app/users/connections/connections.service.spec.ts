import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionsService } from './connections.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ServicesService } from '../../services/services.service';
import { NotFoundException } from '@nestjs/common';

describe('ConnectionsService', () => {
  let service: ConnectionsService;
  let prismaService: PrismaService;
  let servicesService: ServicesService;

  const mockPrismaService = {
    connections: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockServicesService = {
    getServiceByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ServicesService, useValue: mockServicesService },
      ],
    }).compile();

    service = module.get<ConnectionsService>(ConnectionsService);
    prismaService = module.get<PrismaService>(PrismaService);
    servicesService = module.get<ServicesService>(ServicesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createConnection', () => {
    it('should create a new connection when connection does not exist', async () => {
      const serviceName = 'GitHub';
      const userId = 1;
      const provider = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        expires_at: null,
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        connection_name: 'GitHub',
        account_identifier: 'github-123',
        scopes: ['user', 'repo'],
      };

      const mockService = {
        id: 1,
        name: 'GitHub',
        service_color: '#181717',
        icon_url: '/assets/github.png',
        api_base_url: 'https://api.github.com',
        auth_type: 'oauth2',
        documentation_url: 'https://docs.github.com',
        is_active: true,
        created_at: new Date('2021-10-04'),
      };

      mockServicesService.getServiceByName.mockResolvedValue(mockService);
      mockPrismaService.connections.findFirst.mockResolvedValue(null);
      mockPrismaService.connections.create.mockResolvedValue({
        id: 1,
        user_id: userId,
        service_id: mockService.id,
        connection_name: provider.connection_name,
        account_identifier: provider.account_identifier,
        access_token: provider.access_token,
        refresh_token: provider.refresh_token,
        expires_at: provider.expires_at,
        rate_limit_remaining: provider.rate_limit_remaining,
        rate_limit_reset: provider.rate_limit_reset,
        scopes: 'user,repo',
        is_active: true,
        created_at: new Date('2021-10-04'),
        last_used_at: null,
      });

      await service.createConnection(serviceName, userId, provider);

      expect(mockServicesService.getServiceByName).toHaveBeenCalledWith(
        serviceName,
      );
      expect(mockPrismaService.connections.findFirst).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          service_id: mockService.id,
          account_identifier: provider.account_identifier,
        },
      });
      expect(mockPrismaService.connections.create).toHaveBeenCalledWith({
        data: {
          user_id: userId,
          service_id: mockService.id,
          access_token: provider.access_token,
          refresh_token: provider.refresh_token,
          expires_at: provider.expires_at,
          rate_limit_remaining: provider.rate_limit_remaining,
          rate_limit_reset: provider.rate_limit_reset,
          connection_name: provider.connection_name,
          account_identifier: provider.account_identifier,
          scopes: 'user,repo',
        },
      });
    });

    it('should update existing connection', async () => {
      const serviceName = 'GitHub';
      const userId = 1;
      const provider = {
        access_token: 'new_access_token',
        refresh_token: 'new_refresh_token',
        expires_at: null,
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        connection_name: 'GitHub Updated',
        account_identifier: 'github-123',
        scopes: ['user', 'repo', 'admin'],
      };

      const mockService = {
        id: 1,
        name: 'GitHub',
        service_color: '#181717',
        icon_url: '/assets/github.png',
        api_base_url: 'https://api.github.com',
        auth_type: 'oauth2',
        documentation_url: 'https://docs.github.com',
        is_active: true,
        created_at: new Date('2021-10-04'),
      };

      const existingConnection = {
        id: 1,
        user_id: userId,
        service_id: mockService.id,
        connection_name: 'GitHub',
        account_identifier: 'github-123',
        access_token: 'old_token',
        refresh_token: 'old_refresh',
        expires_at: null,
        rate_limit_remaining: null,
        rate_limit_reset: null,
        scopes: 'user,repo',
        is_active: true,
        created_at: new Date('2021-10-04'),
        last_used_at: null,
      };

      mockServicesService.getServiceByName.mockResolvedValue(mockService);
      mockPrismaService.connections.findFirst.mockResolvedValue(
        existingConnection,
      );
      mockPrismaService.connections.update.mockResolvedValue({
        ...existingConnection,
        access_token: provider.access_token,
        refresh_token: provider.refresh_token,
        connection_name: provider.connection_name,
        scopes: 'user,repo,admin',
      });

      await service.createConnection(serviceName, userId, provider);

      expect(mockPrismaService.connections.update).toHaveBeenCalledWith({
        where: {
          id_user_id_service_id_account_identifier: {
            id: existingConnection.id,
            user_id: existingConnection.user_id,
            service_id: existingConnection.service_id,
            account_identifier: existingConnection.account_identifier,
          },
        },
        data: {
          user_id: userId,
          service_id: mockService.id,
          access_token: provider.access_token,
          refresh_token: provider.refresh_token,
          expires_at: provider.expires_at,
          rate_limit_remaining: provider.rate_limit_remaining,
          rate_limit_reset: provider.rate_limit_reset,
          connection_name: provider.connection_name,
          account_identifier: provider.account_identifier,
          scopes: 'user,repo,admin',
        },
      });
      expect(mockPrismaService.connections.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if service does not exist', async () => {
      const serviceName = 'NonExistent';
      const userId = 1;
      const provider = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        expires_at: null,
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        connection_name: 'NonExistent',
        account_identifier: 'non-123',
        scopes: ['user'],
      };

      mockServicesService.getServiceByName.mockResolvedValue(null);

      await expect(
        service.createConnection(serviceName, userId, provider),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.createConnection(serviceName, userId, provider),
      ).rejects.toThrow(`The service ${serviceName} do not exists.`);

      expect(mockPrismaService.connections.findFirst).not.toHaveBeenCalled();
      expect(mockPrismaService.connections.create).not.toHaveBeenCalled();
    });

    it('should handle connection with expires_at', async () => {
      const serviceName = 'Spotify';
      const userId = 1;
      const expiresAt = new Date('2021-10-05');
      const provider = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        expires_at: expiresAt,
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        connection_name: 'Spotify',
        account_identifier: 'spotify-123',
        scopes: ['user-read-email'],
      };

      const mockService = {
        id: 2,
        name: 'Spotify',
        service_color: '#1DB954',
        icon_url: '/assets/spotify.png',
        api_base_url: 'https://api.spotify.com',
        auth_type: 'oauth2',
        documentation_url: 'https://developer.spotify.com',
        is_active: true,
        created_at: new Date('2021-10-04'),
      };

      mockServicesService.getServiceByName.mockResolvedValue(mockService);
      mockPrismaService.connections.findFirst.mockResolvedValue(null);
      mockPrismaService.connections.create.mockResolvedValue({
        id: 1,
        user_id: userId,
        service_id: mockService.id,
        connection_name: provider.connection_name,
        account_identifier: provider.account_identifier,
        access_token: provider.access_token,
        refresh_token: provider.refresh_token,
        expires_at: expiresAt,
        rate_limit_remaining: null,
        rate_limit_reset: null,
        scopes: 'user-read-email',
        is_active: true,
        created_at: new Date('2021-10-04'),
        last_used_at: null,
      });

      await service.createConnection(serviceName, userId, provider);

      expect(mockPrismaService.connections.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          expires_at: expiresAt,
        }),
      });
    });
  });

  describe('getUserConnection', () => {
    it('should return user connection by user_id, service_id, and account_identifier', async () => {
      const mockConnection = {
        id: 1,
        user_id: 1,
        service_id: 1,
        connection_name: 'GitHub',
        account_identifier: 'github-123',
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: null,
        rate_limit_remaining: null,
        rate_limit_reset: null,
        scopes: 'user,repo',
        is_active: true,
        created_at: new Date('2021-10-04'),
        last_used_at: null,
      };

      mockPrismaService.connections.findFirst.mockResolvedValue(
        mockConnection,
      );

      const result = await service.getUserConnection(1, 1, 'github-123');

      expect(result).toEqual(mockConnection);
      expect(mockPrismaService.connections.findFirst).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          service_id: 1,
          account_identifier: 'github-123',
        },
      });
    });

    it('should throw NotFoundException if connection not found', async () => {
      mockPrismaService.connections.findFirst.mockResolvedValue(null);

      await expect(
        service.getUserConnection(1, 999, 'nonexistent-123'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getUserConnection(1, 999, 'nonexistent-123'),
      ).rejects.toThrow(
        `Connection with account's id nonexistent-123 do not exists.`,
      );
    });
  });

  describe('getAllUserConnections', () => {
    it('should return all active connections for a user', async () => {
      const mockConnections = [
        {
          id: 1,
          user_id: 1,
          service_id: 1,
          connection_name: 'GitHub',
          account_identifier: 'github-123',
          access_token: 'token1',
          refresh_token: 'refresh1',
          expires_at: null,
          rate_limit_remaining: null,
          rate_limit_reset: null,
          scopes: 'user,repo',
          is_active: true,
          created_at: new Date('2021-10-04'),
          last_used_at: null,
          service: {
            id: 1,
            name: 'GitHub',
            service_color: '#181717',
            icon_url: '/assets/github.png',
            api_base_url: 'https://api.github.com',
            auth_type: 'oauth2',
            documentation_url: 'https://docs.github.com',
            is_active: true,
            created_at: new Date('2021-10-04'),
          },
        },
        {
          id: 2,
          user_id: 1,
          service_id: 2,
          connection_name: 'Discord',
          account_identifier: 'discord-456',
          access_token: 'token2',
          refresh_token: 'refresh2',
          expires_at: null,
          rate_limit_remaining: null,
          rate_limit_reset: null,
          scopes: 'identify,email',
          is_active: true,
          created_at: new Date('2021-10-04'),
          last_used_at: new Date('2021-10-05'),
          service: {
            id: 2,
            name: 'Discord',
            service_color: '#5865F2',
            icon_url: '/assets/discord.png',
            api_base_url: 'https://discord.com/api',
            auth_type: 'oauth2',
            documentation_url: 'https://discord.com/developers/docs',
            is_active: true,
            created_at: new Date('2021-10-04'),
          },
        },
      ];

      mockPrismaService.connections.findMany.mockResolvedValue(
        mockConnections,
      );

      const result = await service.getAllUserConnections(1);

      expect(result).toEqual(mockConnections);
      expect(mockPrismaService.connections.findMany).toHaveBeenCalledWith({
        where: { user_id: 1, is_active: true },
        include: { service: true },
      });
    });

    it('should return empty array if user has no active connections', async () => {
      mockPrismaService.connections.findMany.mockResolvedValue([]);

      const result = await service.getAllUserConnections(1);

      expect(result).toEqual([]);
    });
  });

  describe('getUserConnectionsByService', () => {
    it('should return active connections for a specific service', async () => {
      const mockConnections = [
        {
          id: 1,
          user_id: 1,
          service_id: 1,
          connection_name: 'GitHub Account 1',
          account_identifier: 'github-123',
          access_token: 'token1',
          refresh_token: 'refresh1',
          expires_at: null,
          rate_limit_remaining: null,
          rate_limit_reset: null,
          scopes: 'user,repo',
          is_active: true,
          created_at: new Date('2021-10-04'),
          last_used_at: null,
          service: {
            id: 1,
            name: 'GitHub',
            service_color: '#181717',
            icon_url: '/assets/github.png',
            api_base_url: 'https://api.github.com',
            auth_type: 'oauth2',
            documentation_url: 'https://docs.github.com',
            is_active: true,
            created_at: new Date('2021-10-04'),
          },
        },
      ];

      mockPrismaService.connections.findMany.mockResolvedValue(
        mockConnections,
      );

      const result = await service.getUserConnectionsByService(1, 1);

      expect(result).toEqual(mockConnections);
      expect(mockPrismaService.connections.findMany).toHaveBeenCalledWith({
        where: { user_id: 1, service_id: 1, is_active: true },
        include: { service: true },
      });
    });

    it('should return empty array if no active connections for service', async () => {
      mockPrismaService.connections.findMany.mockResolvedValue([]);

      const result = await service.getUserConnectionsByService(1, 999);

      expect(result).toEqual([]);
    });
  });
});


