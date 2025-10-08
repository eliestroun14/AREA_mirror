import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ServicesService', () => {
  let service: ServicesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    services: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    triggers: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    actions: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllServices', () => {
    it('should return all services', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'github',
          icon_url: '/assets/github.png',
          api_base_url: 'https://api.github.com',
          service_color: '#181717',
          auth_type: 'oauth2',
          documentation_url: 'https://docs.github.com',
          is_active: true,
          created_at: new Date('2021-10-04'),
        },
        {
          id: 2,
          name: 'discord',
          icon_url: '/assets/discord.png',
          api_base_url: 'https://discord.com/api',
          service_color: '#5865F2',
          auth_type: 'oauth2',
          documentation_url: 'https://discord.com/developers/docs',
          is_active: true,
          created_at: new Date('2021-10-04'),
        },
      ];

      mockPrismaService.services.findMany.mockResolvedValue(mockServices);

      const result = await service.getAllServices();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('github');
      expect(result[1].name).toBe('discord');
      expect(mockPrismaService.services.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no services', async () => {
      mockPrismaService.services.findMany.mockResolvedValue([]);

      const result = await service.getAllServices();

      expect(result).toEqual([]);
    });
  });

  describe('getServiceByName', () => {
    it('should return service by name', async () => {
      const mockService = {
        id: 1,
        name: 'github',
        icon_url: '/assets/github.png',
        api_base_url: 'https://api.github.com',
        service_color: '#181717',
        auth_type: 'oauth2',
        documentation_url: 'https://docs.github.com',
        is_active: true,
        created_at: new Date('2021-10-04'),
      };

      mockPrismaService.services.findUnique.mockResolvedValue(mockService);

      const result = await service.getServiceByName('github');

      expect(result.name).toBe('github');
      expect(result.id).toBe(1);
      expect(mockPrismaService.services.findUnique).toHaveBeenCalledWith({
        where: { name: 'github' },
      });
    });

    it('should throw NotFoundException when service not found', async () => {
      mockPrismaService.services.findUnique.mockResolvedValue(null);

      await expect(service.getServiceByName('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getServiceByName('nonexistent')).rejects.toThrow(
        'Service with name nonexistent do not exists.',
      );
    });
  });

  describe('getServiceById', () => {
    it('should return service by id', async () => {
      const mockService = {
        id: 1,
        name: 'github',
        icon_url: '/assets/github.png',
        api_base_url: 'https://api.github.com',
        service_color: '#181717',
        auth_type: 'oauth2',
        documentation_url: 'https://docs.github.com',
        is_active: true,
        created_at: new Date('2021-10-04'),
      };

      mockPrismaService.services.findUnique.mockResolvedValue(mockService);

      const result = await service.getServiceById(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe('github');
      expect(mockPrismaService.services.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when service not found by id', async () => {
      mockPrismaService.services.findUnique.mockResolvedValue(null);

      await expect(service.getServiceById(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getServiceById(999)).rejects.toThrow(
        'Service with id 999 do not exists.',
      );
    });
  });

  describe('getTriggersByService', () => {
    it('should return all triggers for a service', async () => {
      const mockTriggers = [
        {
          id: 1,
          service_id: 1,
          http_request_id: 1,
          webhook_id: null,
          trigger_type: 'polling',
          name: 'New Issue',
          description: 'Triggers when a new issue is created',
          polling_interval: 60,
          fields: {},
          variables: {},
          is_active: true,
          created_at: new Date('2021-10-04'),
          updated_at: new Date('2021-10-04'),
        },
      ];

      mockPrismaService.triggers.findMany.mockResolvedValue(mockTriggers);

      const result = await service.getTriggersByService(1);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('New Issue');
      expect(result[0].service_id).toBe(1);
      expect(mockPrismaService.triggers.findMany).toHaveBeenCalledWith({
        where: { service_id: 1 },
      });
    });

    it('should return empty array when no triggers', async () => {
      mockPrismaService.triggers.findMany.mockResolvedValue([]);

      const result = await service.getTriggersByService(1);

      expect(result).toEqual([]);
    });
  });

  describe('getActionsByService', () => {
    it('should return all actions for a service', async () => {
      const mockActions = [
        {
          id: 1,
          service_id: 1,
          http_request_id: 1,
          name: 'Create Issue',
          description: 'Creates a new issue',
          fields: {},
          variables: {},
          is_active: true,
          created_at: new Date('2021-10-04'),
          updated_at: new Date('2021-10-04'),
        },
      ];

      mockPrismaService.actions.findMany.mockResolvedValue(mockActions);

      const result = await service.getActionsByService(1);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Create Issue');
      expect(result[0].service_id).toBe(1);
      expect(mockPrismaService.actions.findMany).toHaveBeenCalledWith({
        where: { service_id: 1 },
      });
    });

    it('should return empty array when no actions', async () => {
      mockPrismaService.actions.findMany.mockResolvedValue([]);

      const result = await service.getActionsByService(1);

      expect(result).toEqual([]);
    });
  });

  describe('getActionByService', () => {
    it('should return specific action for a service', async () => {
      const mockAction = {
        id: 1,
        service_id: 1,
        http_request_id: 1,
        name: 'Create Issue',
        description: 'Creates a new issue',
        fields: {},
        variables: {},
        is_active: true,
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      mockPrismaService.actions.findFirst.mockResolvedValue(mockAction);

      const result = await service.getActionByService(1, 1);

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Create Issue');
      expect(mockPrismaService.actions.findFirst).toHaveBeenCalledWith({
        where: { id: 1, service_id: 1 },
      });
    });

    it('should return null when action not found', async () => {
      mockPrismaService.actions.findFirst.mockResolvedValue(null);

      const result = await service.getActionByService(1, 999);

      expect(result).toBeNull();
    });
  });

  describe('getTriggerByService', () => {
    it('should return specific trigger for a service', async () => {
      const mockTrigger = {
        id: 1,
        service_id: 1,
        http_request_id: 1,
        webhook_id: null,
        trigger_type: 'polling',
        name: 'New Issue',
        description: 'Triggers when a new issue is created',
        polling_interval: 60,
        fields: {},
        variables: {},
        is_active: true,
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      mockPrismaService.triggers.findFirst.mockResolvedValue(mockTrigger);

      const result = await service.getTriggerByService(1, 1);

      expect(result).not.toBeNull();
      expect(result?.name).toBe('New Issue');
      expect(mockPrismaService.triggers.findFirst).toHaveBeenCalledWith({
        where: { id: 1, service_id: 1 },
      });
    });

    it('should return null when trigger not found', async () => {
      mockPrismaService.triggers.findFirst.mockResolvedValue(null);

      const result = await service.getTriggerByService(1, 999);

      expect(result).toBeNull();
    });
  });

  describe('searchServices', () => {
    it('should search services by name', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'github',
          icon_url: '/assets/github.png',
          api_base_url: 'https://api.github.com',
          service_color: '#181717',
          auth_type: 'oauth2',
          documentation_url: 'https://docs.github.com',
          is_active: true,
          created_at: new Date('2021-10-04'),
        },
      ];

      mockPrismaService.services.findMany.mockResolvedValue(mockServices);

      const result = await service.searchServices('git');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('github');
      expect(mockPrismaService.services.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'git',
            mode: 'insensitive',
          },
        },
        skip: undefined,
        take: undefined,
      });
    });

    it('should support pagination in search', async () => {
      mockPrismaService.services.findMany.mockResolvedValue([]);

      await service.searchServices('test', 0, 10);

      expect(mockPrismaService.services.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'test',
            mode: 'insensitive',
          },
        },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('searchTriggers', () => {
    it('should search triggers and return unique services', async () => {
      const mockTriggersWithService = [
        {
          id: 1,
          service_id: 1,
          name: 'New Issue',
          service: {
            id: 1,
            name: 'github',
            icon_url: '/assets/github.png',
            api_base_url: 'https://api.github.com',
            service_color: '#181717',
            auth_type: 'oauth2',
            documentation_url: 'https://docs.github.com',
            is_active: true,
            created_at: new Date('2021-10-04'),
          },
        },
      ];

      mockPrismaService.triggers.findMany.mockResolvedValue(
        mockTriggersWithService,
      );

      const result = await service.searchTriggers('issue');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('github');
    });
  });

  describe('searchActions', () => {
    it('should search actions and return unique services', async () => {
      const mockActionsWithService = [
        {
          id: 1,
          service_id: 1,
          name: 'Create Issue',
          service: {
            id: 1,
            name: 'github',
            icon_url: '/assets/github.png',
            api_base_url: 'https://api.github.com',
            service_color: '#181717',
            auth_type: 'oauth2',
            documentation_url: 'https://docs.github.com',
            is_active: true,
            created_at: new Date('2021-10-04'),
          },
        },
      ];

      mockPrismaService.actions.findMany.mockResolvedValue(
        mockActionsWithService,
      );

      const result = await service.searchActions('issue');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('github');
    });
  });

  describe('searchAll', () => {
    it('should search across all types and merge results', async () => {
      const mockService = {
        id: 1,
        name: 'github',
        icon_url: '/assets/github.png',
        api_base_url: 'https://api.github.com',
        service_color: '#181717',
        auth_type: 'oauth2',
        documentation_url: 'https://docs.github.com',
        is_active: true,
        created_at: new Date('2021-10-04'),
      };

      mockPrismaService.services.findMany.mockResolvedValue([mockService]);
      mockPrismaService.triggers.findMany.mockResolvedValue([]);
      mockPrismaService.actions.findMany.mockResolvedValue([]);

      const result = await service.searchAll('git');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('github');
    });

    it('should remove duplicate services in search results', async () => {
      const mockService = {
        id: 1,
        name: 'github',
        icon_url: '/assets/github.png',
        api_base_url: 'https://api.github.com',
        service_color: '#181717',
        auth_type: 'oauth2',
        documentation_url: 'https://docs.github.com',
        is_active: true,
        created_at: new Date('2021-10-04'),
      };

      const mockTrigger = {
        id: 1,
        service_id: 1,
        name: 'New Issue',
        service: mockService,
      };

      mockPrismaService.services.findMany.mockResolvedValue([mockService]);
      mockPrismaService.triggers.findMany.mockResolvedValue([mockTrigger]);
      mockPrismaService.actions.findMany.mockResolvedValue([]);

      const result = await service.searchAll('git');

      expect(result).toHaveLength(1);
    });
  });
});
