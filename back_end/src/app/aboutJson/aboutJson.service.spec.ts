import { Test, TestingModule } from '@nestjs/testing';
import { AboutJsonService } from './aboutJson.service';
import { PrismaService } from '@root/prisma/prisma.service';
import type { Request } from 'express';

describe('AboutJsonService', () => {
  let service: AboutJsonService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    services: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AboutJsonService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AboutJsonService>(AboutJsonService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAboutJson', () => {
    it('should return formatted about.json with services, actions and reactions', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'github',
          description: 'GitHub service',
          actions: [
            {
              id: 1,
              name: 'create_issue',
              description: 'Create a new issue',
              serviceId: 1,
            },
            {
              id: 2,
              name: 'add_comment',
              description: 'Add a comment',
              serviceId: 1,
            },
          ],
          triggers: [
            {
              id: 1,
              name: 'on_push',
              description: 'Triggered on push',
              serviceId: 1,
            },
            {
              id: 2,
              name: 'on_issue_opened',
              description: 'Triggered when issue is opened',
              serviceId: 1,
            },
          ],
        },
        {
          id: 2,
          name: 'discord',
          description: 'Discord service',
          actions: [
            {
              id: 3,
              name: 'send_message',
              description: 'Send a message to a channel',
              serviceId: 2,
            },
          ],
          triggers: [
            {
              id: 3,
              name: 'on_message',
              description: 'Triggered on new message',
              serviceId: 2,
            },
          ],
        },
      ];

      mockPrismaService.services.findMany.mockResolvedValue(mockServices);

      const mockRequest = {
        ip: '192.168.1.100',
        socket: {
          remoteAddress: '192.168.1.100',
        },
      } as unknown as Request;

      const result = await service.getAboutJson(mockRequest);

      expect(result).toBeDefined();
      expect(result.client).toBeDefined();
      expect(result.client.host).toBe('192.168.1.100');
      expect(result.server).toBeDefined();
      expect(result.server.current_time).toBeDefined();
      expect(typeof result.server.current_time).toBe('number');
      expect(result.server.services).toHaveLength(2);

      // Vérifier le premier service (github)
      expect(result.server.services[0].name).toBe('github');
      expect(result.server.services[0].actions).toHaveLength(2);
      expect(result.server.services[0].actions[0]).toEqual({
        name: 'on_push',
        description: 'Triggered on push',
      });
      expect(result.server.services[0].reactions).toHaveLength(2);
      expect(result.server.services[0].reactions[0]).toEqual({
        name: 'create_issue',
        description: 'Create a new issue',
      });

      // Vérifier le deuxième service (discord)
      expect(result.server.services[1].name).toBe('discord');
      expect(result.server.services[1].actions).toHaveLength(1);
      expect(result.server.services[1].reactions).toHaveLength(1);

      expect(prismaService.services.findMany).toHaveBeenCalledWith({
        include: {
          actions: true,
          triggers: true,
        },
      });
    });

    it('should handle IPv6 format and strip ::ffff: prefix', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'test_service',
          description: 'Test service',
          actions: [],
          triggers: [],
        },
      ];

      mockPrismaService.services.findMany.mockResolvedValue(mockServices);

      const mockRequest = {
        ip: '::ffff:127.0.0.1',
        socket: {
          remoteAddress: '::ffff:127.0.0.1',
        },
      } as unknown as Request;

      const result = await service.getAboutJson(mockRequest);

      expect(result.client.host).toBe('127.0.0.1');
    });

    it('should use socket.remoteAddress when req.ip is not available', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'test_service',
          description: 'Test service',
          actions: [],
          triggers: [],
        },
      ];

      mockPrismaService.services.findMany.mockResolvedValue(mockServices);

      const mockRequest = {
        ip: undefined,
        socket: {
          remoteAddress: '10.0.0.1',
        },
      } as unknown as Request;

      const result = await service.getAboutJson(mockRequest);

      expect(result.client.host).toBe('10.0.0.1');
    });

    it('should handle empty IP gracefully', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'test_service',
          description: 'Test service',
          actions: [],
          triggers: [],
        },
      ];

      mockPrismaService.services.findMany.mockResolvedValue(mockServices);

      const mockRequest = {
        ip: undefined,
        socket: {},
      } as unknown as Request;

      const result = await service.getAboutJson(mockRequest);

      expect(result.client.host).toBe('');
    });

    it('should return empty services array when no services exist', async () => {
      mockPrismaService.services.findMany.mockResolvedValue([]);

      const mockRequest = {
        ip: '127.0.0.1',
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as unknown as Request;

      const result = await service.getAboutJson(mockRequest);

      expect(result.server.services).toEqual([]);
      expect(result.client.host).toBe('127.0.0.1');
      expect(result.server.current_time).toBeDefined();
    });

    it('should handle services with no actions or triggers', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'empty_service',
          description: 'Service with no actions/triggers',
          actions: [],
          triggers: [],
        },
      ];

      mockPrismaService.services.findMany.mockResolvedValue(mockServices);

      const mockRequest = {
        ip: '127.0.0.1',
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as unknown as Request;

      const result = await service.getAboutJson(mockRequest);

      expect(result.server.services).toHaveLength(1);
      expect(result.server.services[0].name).toBe('empty_service');
      expect(result.server.services[0].actions).toEqual([]);
      expect(result.server.services[0].reactions).toEqual([]);
    });

    it('should return current_time as Unix timestamp in seconds', async () => {
      const mockServices = [];
      mockPrismaService.services.findMany.mockResolvedValue(mockServices);

      const mockRequest = {
        ip: '127.0.0.1',
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as unknown as Request;

      const beforeTimestamp = Math.floor(Date.now() / 1000);
      const result = await service.getAboutJson(mockRequest);
      const afterTimestamp = Math.floor(Date.now() / 1000);

      expect(result.server.current_time).toBeGreaterThanOrEqual(
        beforeTimestamp,
      );
      expect(result.server.current_time).toBeLessThanOrEqual(afterTimestamp);
    });

    it('should throw error when prisma service fails', async () => {
      mockPrismaService.services.findMany.mockRejectedValue(
        new Error('Database connection failed'),
      );

      const mockRequest = {
        ip: '127.0.0.1',
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as unknown as Request;

      await expect(service.getAboutJson(mockRequest)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
