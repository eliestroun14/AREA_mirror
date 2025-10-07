import { Test, TestingModule } from '@nestjs/testing';
import { StepsService } from './steps.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConnectionsService } from '../../users/connections/connections.service';
import { ServicesService } from '../../services/services.service';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('StepsService', () => {
  let service: StepsService;
  let prismaService: PrismaService;
  let connectionsService: ConnectionsService;
  let servicesService: ServicesService;

  const mockPrismaService = {
    zap_steps: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    triggers: {
      findUnique: jest.fn(),
    },
    actions: {
      findUnique: jest.fn(),
    },
    services: {
      findUnique: jest.fn(),
    },
  };

  const mockConnectionsService = {
    getUserConnection: jest.fn(),
  };

  const mockServicesService = {
    getServiceById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StepsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConnectionsService, useValue: mockConnectionsService },
        { provide: ServicesService, useValue: mockServicesService },
      ],
    }).compile();

    service = module.get<StepsService>(StepsService);
    prismaService = module.get<PrismaService>(PrismaService);
    connectionsService = module.get<ConnectionsService>(ConnectionsService);
    servicesService = module.get<ServicesService>(ServicesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTriggerStep', () => {
    it('should create a new trigger step', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        triggerId: 1,
        accountIdentifier: 'github-123',
        payload: { branch: 'main' },
      };

      const mockTrigger = {
        id: 1,
        service_id: 1,
        trigger_type: 'webhook',
        name: 'GitHub Push',
        description: 'Triggered on push',
        created_at: new Date(),
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
        created_at: new Date(),
      };

      const mockConnection = {
        id: 1,
        user_id: userId,
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
        created_at: new Date(),
        last_used_at: null,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);
      mockPrismaService.triggers.findUnique.mockResolvedValue(mockTrigger);
      mockPrismaService.services.findUnique.mockResolvedValue(mockService);
      mockConnectionsService.getUserConnection.mockResolvedValue(
        mockConnection,
      );
      mockPrismaService.zap_steps.create.mockResolvedValue({
        id: 1,
        zap_id: zapId,
        trigger_id: data.triggerId,
        action_id: null,
        step_type: 'TRIGGER',
        step_order: 0,
        connection_id: mockConnection.id,
        source_step_id: null,
        payload: data.payload,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await service.createTriggerStep(zapId, userId, data);

      expect(mockPrismaService.zap_steps.findFirst).toHaveBeenCalledWith({
        where: {
          zap_id: zapId,
          step_type: 'TRIGGER',
          step_order: 0,
        },
      });
      expect(mockPrismaService.triggers.findUnique).toHaveBeenCalledWith({
        where: { id: data.triggerId },
      });
      expect(mockPrismaService.services.findUnique).toHaveBeenCalledWith({
        where: { id: mockTrigger.service_id },
      });
      expect(mockConnectionsService.getUserConnection).toHaveBeenCalledWith(
        userId,
        mockService.id,
        data.accountIdentifier,
      );
      expect(mockPrismaService.zap_steps.create).toHaveBeenCalledWith({
        data: {
          zap_id: zapId,
          trigger_id: data.triggerId,
          step_type: 'TRIGGER',
          step_order: 0,
          connection_id: mockConnection.id,
          payload: data.payload,
        },
      });
    });

    it('should throw ConflictException when trigger already exists', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        triggerId: 1,
        accountIdentifier: 'github-123',
        payload: {},
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue({
        id: 1,
        zap_id: zapId,
        step_type: 'TRIGGER',
      });

      await expect(
        service.createTriggerStep(zapId, userId, data),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.createTriggerStep(zapId, userId, data),
      ).rejects.toThrow(
        'The trigger step is already defined for this zap.',
      );
    });

    it('should throw NotFoundException when trigger not found', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        triggerId: 999,
        accountIdentifier: 'github-123',
        payload: {},
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);
      mockPrismaService.triggers.findUnique.mockResolvedValue(null);

      await expect(
        service.createTriggerStep(zapId, userId, data),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.createTriggerStep(zapId, userId, data),
      ).rejects.toThrow('Trigger with id 999 do not exists.');
    });

    it('should throw NotFoundException when service not found', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        triggerId: 1,
        accountIdentifier: 'github-123',
        payload: {},
      };

      const mockTrigger = {
        id: 1,
        service_id: 999,
        trigger_type: 'webhook',
        name: 'GitHub Push',
        description: 'Triggered on push',
        created_at: new Date(),
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);
      mockPrismaService.triggers.findUnique.mockResolvedValue(mockTrigger);
      mockPrismaService.services.findUnique.mockResolvedValue(null);

      await expect(
        service.createTriggerStep(zapId, userId, data),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when connection not found', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        triggerId: 1,
        accountIdentifier: 'nonexistent-123',
        payload: {},
      };

      const mockTrigger = {
        id: 1,
        service_id: 1,
        trigger_type: 'webhook',
        name: 'GitHub Push',
        description: 'Triggered on push',
        created_at: new Date(),
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
        created_at: new Date(),
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);
      mockPrismaService.triggers.findUnique.mockResolvedValue(mockTrigger);
      mockPrismaService.services.findUnique.mockResolvedValue(mockService);
      mockConnectionsService.getUserConnection.mockResolvedValue(null);

      await expect(
        service.createTriggerStep(zapId, userId, data),
      ).rejects.toThrow(NotFoundException);
    });

    it('should allow schedule trigger without connection', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        triggerId: 1,
        accountIdentifier: 'schedule-account',
        payload: { cron: '0 0 * * *' },
      };

      const mockTrigger = {
        id: 1,
        service_id: 1,
        trigger_type: 'SCHEDULE',
        name: 'Schedule Trigger',
        description: 'Scheduled trigger',
        created_at: new Date(),
      };

      const mockService = {
        id: 1,
        name: 'Schedule',
        service_color: '#000000',
        icon_url: '/assets/schedule.png',
        api_base_url: '',
        auth_type: 'none',
        documentation_url: '',
        is_active: true,
        created_at: new Date(),
      };

      const mockConnection = {
        id: 1,
        user_id: userId,
        service_id: 1,
        connection_name: 'Schedule',
        account_identifier: 'schedule-account',
        access_token: '',
        refresh_token: null,
        expires_at: null,
        rate_limit_remaining: null,
        rate_limit_reset: null,
        scopes: '',
        is_active: true,
        created_at: new Date(),
        last_used_at: null,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);
      mockPrismaService.triggers.findUnique.mockResolvedValue(mockTrigger);
      mockPrismaService.services.findUnique.mockResolvedValue(mockService);
      mockConnectionsService.getUserConnection.mockResolvedValue(
        mockConnection,
      );
      mockPrismaService.zap_steps.create.mockResolvedValue({
        id: 1,
        zap_id: zapId,
        trigger_id: data.triggerId,
        action_id: null,
        step_type: 'TRIGGER',
        step_order: 0,
        connection_id: mockConnection.id,
        source_step_id: null,
        payload: data.payload,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await service.createTriggerStep(zapId, userId, data);

      expect(mockPrismaService.zap_steps.create).toHaveBeenCalled();
    });
  });

  describe('getTriggerStepOf', () => {
    it('should return trigger step of a zap', async () => {
      const zapId = 1;
      const mockTriggerStep = {
        id: 1,
        zap_id: zapId,
        trigger_id: 1,
        action_id: null,
        step_type: 'TRIGGER',
        step_order: 0,
        connection_id: 1,
        source_step_id: null,
        payload: { branch: 'main' },
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-05'),
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(
        mockTriggerStep,
      );

      const result = await service.getTriggerStepOf(zapId);

      expect(result).toEqual({
        id: 1,
        zap_id: zapId,
        action_id: null,
        trigger_id: 1,
        connection_id: 1,
        step_type: 'TRIGGER',
        step_order: 0,
        created_at: mockTriggerStep.created_at,
        updated_at: mockTriggerStep.updated_at,
        payload: { branch: 'main' },
      });
      expect(mockPrismaService.zap_steps.findFirst).toHaveBeenCalledWith({
        where: {
          zap_id: zapId,
          OR: [{ step_order: 0 }, { step_type: 'TRIGGER' }],
        },
      });
    });

    it('should throw NotFoundException when trigger step not found', async () => {
      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);

      await expect(service.getTriggerStepOf(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getTriggerStepOf(999)).rejects.toThrow(
        'Zap with id 999 does not have a trigger.',
      );
    });
  });

  describe('updateTriggerStep', () => {
    it('should update trigger with new triggerId', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        triggerId: 2,
        accountIdentifier: 'github-456',
        payload: { branch: 'develop' },
      };

      const mockStep = {
        id: 1,
        zap_id: zapId,
        trigger_id: 1,
        step_type: 'TRIGGER',
        step_order: 0,
      };

      const mockTrigger = {
        id: 2,
        service_id: 1,
        trigger_type: 'webhook',
        name: 'GitHub Pull Request',
        description: 'Triggered on PR',
        created_at: new Date(),
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
        created_at: new Date(),
      };

      const mockConnection = {
        id: 2,
        user_id: userId,
        service_id: 1,
        connection_name: 'GitHub',
        account_identifier: 'github-456',
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: null,
        rate_limit_remaining: null,
        rate_limit_reset: null,
        scopes: 'user,repo',
        is_active: true,
        created_at: new Date(),
        last_used_at: null,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.triggers.findUnique.mockResolvedValue(mockTrigger);
      mockPrismaService.services.findUnique.mockResolvedValue(mockService);
      mockConnectionsService.getUserConnection.mockResolvedValue(mockConnection);
      mockPrismaService.zap_steps.update.mockResolvedValue({
        ...mockStep,
        trigger_id: data.triggerId,
        connection_id: mockConnection.id,
        payload: data.payload,
      });

      await service.updateTriggerStep(zapId, userId, data);

      expect(mockPrismaService.zap_steps.update).toHaveBeenCalledWith({
        where: { id: mockStep.id },
        data: {
          trigger_id: data.triggerId,
          connection_id: mockConnection.id,
          payload: data.payload,
        },
      });
    });

    it('should update only payload', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        payload: { branch: 'feature' },
      };

      const mockStep = {
        id: 1,
        zap_id: zapId,
        trigger_id: 1,
        step_type: 'TRIGGER',
        step_order: 0,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.zap_steps.update.mockResolvedValue({
        ...mockStep,
        payload: data.payload,
      });

      await service.updateTriggerStep(zapId, userId, data);

      expect(mockPrismaService.zap_steps.update).toHaveBeenCalledWith({
        where: { id: mockStep.id },
        data: {
          payload: data.payload,
        },
      });
    });

    it('should throw NotFoundException when step not found', async () => {
      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);

      await expect(
        service.updateTriggerStep(1, 1, { payload: {} }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update only accountIdentifier without triggerId', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        accountIdentifier: 'github-789',
      };

      const mockStep = {
        id: 1,
        zap_id: zapId,
        trigger_id: 1,
        step_type: 'TRIGGER',
        step_order: 0,
      };

      const mockTrigger = {
        id: 1,
        service_id: 1,
        trigger_type: 'webhook',
        name: 'GitHub Push',
        description: 'Triggered on push',
        created_at: new Date(),
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
        created_at: new Date(),
      };

      const mockConnection = {
        id: 3,
        user_id: userId,
        service_id: 1,
        connection_name: 'GitHub',
        account_identifier: 'github-789',
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: null,
        rate_limit_remaining: null,
        rate_limit_reset: null,
        scopes: 'user,repo',
        is_active: true,
        created_at: new Date(),
        last_used_at: null,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.triggers.findUnique.mockResolvedValue(mockTrigger);
      mockPrismaService.services.findUnique.mockResolvedValue(mockService);
      mockConnectionsService.getUserConnection.mockResolvedValue(mockConnection);
      mockPrismaService.zap_steps.update.mockResolvedValue({
        ...mockStep,
        connection_id: mockConnection.id,
      });

      await service.updateTriggerStep(zapId, userId, data);

      expect(mockPrismaService.zap_steps.update).toHaveBeenCalledWith({
        where: { id: mockStep.id },
        data: {
          connection_id: mockConnection.id,
        },
      });
    });

    it('should throw NotFoundException when current trigger not found for accountIdentifier update', async () => {
      const mockStep = {
        id: 1,
        zap_id: 1,
        trigger_id: 1,
        step_type: 'TRIGGER',
        step_order: 0,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.triggers.findUnique.mockResolvedValue(null);

      await expect(
        service.updateTriggerStep(1, 1, { accountIdentifier: 'test-123' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateTriggerStep(1, 1, { accountIdentifier: 'test-123' }),
      ).rejects.toThrow('Current trigger not found.');
    });

    it('should throw NotFoundException when service not found for accountIdentifier update', async () => {
      const mockStep = {
        id: 1,
        zap_id: 1,
        trigger_id: 1,
        step_type: 'TRIGGER',
        step_order: 0,
      };

      const mockTrigger = {
        id: 1,
        service_id: 999,
        trigger_type: 'webhook',
        name: 'Test',
        description: 'Test',
        created_at: new Date(),
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.triggers.findUnique.mockResolvedValue(mockTrigger);
      mockPrismaService.services.findUnique.mockResolvedValue(null);

      await expect(
        service.updateTriggerStep(1, 1, { accountIdentifier: 'test-123' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when connection not found for accountIdentifier update', async () => {
      const mockStep = {
        id: 1,
        zap_id: 1,
        trigger_id: 1,
        step_type: 'TRIGGER',
        step_order: 0,
      };

      const mockTrigger = {
        id: 1,
        service_id: 1,
        trigger_type: 'webhook',
        name: 'Test',
        description: 'Test',
        created_at: new Date(),
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
        created_at: new Date(),
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.triggers.findUnique.mockResolvedValue(mockTrigger);
      mockPrismaService.services.findUnique.mockResolvedValue(mockService);
      mockConnectionsService.getUserConnection.mockResolvedValue(null);

      await expect(
        service.updateTriggerStep(1, 1, { accountIdentifier: 'nonexistent' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when trigger not found for triggerId update', async () => {
      const mockStep = {
        id: 1,
        zap_id: 1,
        trigger_id: 1,
        step_type: 'TRIGGER',
        step_order: 0,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.triggers.findUnique.mockResolvedValue(null);

      await expect(
        service.updateTriggerStep(1, 1, { triggerId: 999 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when service not found for triggerId update', async () => {
      const mockStep = {
        id: 1,
        zap_id: 1,
        trigger_id: 1,
        step_type: 'TRIGGER',
        step_order: 0,
      };

      const mockTrigger = {
        id: 2,
        service_id: 999,
        trigger_type: 'webhook',
        name: 'Test',
        description: 'Test',
        created_at: new Date(),
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.triggers.findUnique.mockResolvedValue(mockTrigger);
      mockPrismaService.services.findUnique.mockResolvedValue(null);

      await expect(
        service.updateTriggerStep(1, 1, { triggerId: 2 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTriggerStep', () => {
    it('should delete trigger step', async () => {
      const zapId = 1;
      const userId = 1;
      const mockStep = {
        id: 1,
        zap_id: zapId,
        step_type: 'TRIGGER',
        step_order: 0,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.zap_steps.delete.mockResolvedValue(mockStep);

      await service.deleteTriggerStep(zapId, userId);

      expect(mockPrismaService.zap_steps.findFirst).toHaveBeenCalledWith({
        where: {
          zap_id: zapId,
          step_type: 'TRIGGER',
          step_order: 0,
        },
      });
      expect(mockPrismaService.zap_steps.delete).toHaveBeenCalledWith({
        where: { id: mockStep.id },
      });
    });

    it('should throw NotFoundException when trigger step not found', async () => {
      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);

      await expect(service.deleteTriggerStep(999, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.zap_steps.delete).not.toHaveBeenCalled();
    });
  });

  describe('createActionStep', () => {
    it('should create a new action step', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        actionId: 1,
        accountIdentifier: 'discord-123',
        fromStepId: 0,
        stepOrder: 1,
        payload: { message: 'Hello' },
      };

      const mockAction = {
        id: 1,
        service_id: 2,
        name: 'Send Message',
        description: 'Send a message',
        created_at: new Date(),
      };

      const mockService = {
        id: 2,
        name: 'Discord',
        service_color: '#5865F2',
        icon_url: '/assets/discord.png',
        api_base_url: 'https://discord.com/api',
        auth_type: 'oauth2',
        documentation_url: 'https://discord.com/developers/docs',
        is_active: true,
        created_at: new Date(),
      };

      const mockConnection = {
        id: 2,
        user_id: userId,
        service_id: 2,
        connection_name: 'Discord',
        account_identifier: 'discord-123',
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: null,
        rate_limit_remaining: null,
        rate_limit_reset: null,
        scopes: 'messages.write',
        is_active: true,
        created_at: new Date(),
        last_used_at: null,
      };

      mockPrismaService.actions.findUnique.mockResolvedValue(mockAction);
      mockServicesService.getServiceById.mockResolvedValue(mockService);
      mockConnectionsService.getUserConnection.mockResolvedValue(
        mockConnection,
      );
      mockPrismaService.zap_steps.create.mockResolvedValue({
        id: 2,
        zap_id: zapId,
        trigger_id: null,
        action_id: data.actionId,
        step_type: 'ACTION',
        step_order: data.stepOrder,
        connection_id: mockConnection.id,
        source_step_id: data.fromStepId,
        payload: data.payload,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await service.createActionStep(zapId, userId, data);

      expect(mockPrismaService.actions.findUnique).toHaveBeenCalledWith({
        where: { id: data.actionId },
      });
      expect(mockServicesService.getServiceById).toHaveBeenCalledWith(
        mockAction.service_id,
      );
      expect(mockConnectionsService.getUserConnection).toHaveBeenCalledWith(
        userId,
        mockService.id,
        data.accountIdentifier,
      );
      expect(mockPrismaService.zap_steps.create).toHaveBeenCalledWith({
        data: {
          zap_id: zapId,
          source_step_id: data.fromStepId,
          action_id: data.actionId,
          step_type: 'ACTION',
          step_order: data.stepOrder,
          connection_id: mockConnection.id,
          payload: data.payload,
        },
      });
    });

    it('should throw NotFoundException when action not found', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        actionId: 999,
        accountIdentifier: 'discord-123',
        fromStepId: 0,
        stepOrder: 1,
        payload: {},
      };

      mockPrismaService.actions.findUnique.mockResolvedValue(null);

      await expect(
        service.createActionStep(zapId, userId, data),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when service not found', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        actionId: 1,
        accountIdentifier: 'discord-123',
        fromStepId: 0,
        stepOrder: 1,
        payload: {},
      };

      const mockAction = {
        id: 1,
        service_id: 999,
        name: 'Send Message',
        description: 'Send a message',
        created_at: new Date(),
      };

      mockPrismaService.actions.findUnique.mockResolvedValue(mockAction);
      mockServicesService.getServiceById.mockResolvedValue(null);

      await expect(
        service.createActionStep(zapId, userId, data),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when connection not found', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        actionId: 1,
        accountIdentifier: 'nonexistent-123',
        fromStepId: 0,
        stepOrder: 1,
        payload: {},
      };

      const mockAction = {
        id: 1,
        service_id: 2,
        name: 'Send Message',
        description: 'Send a message',
        created_at: new Date(),
      };

      const mockService = {
        id: 2,
        name: 'Discord',
        service_color: '#5865F2',
        icon_url: '/assets/discord.png',
        api_base_url: 'https://discord.com/api',
        auth_type: 'oauth2',
        documentation_url: 'https://discord.com/developers/docs',
        is_active: true,
        created_at: new Date(),
      };

      mockPrismaService.actions.findUnique.mockResolvedValue(mockAction);
      mockServicesService.getServiceById.mockResolvedValue(mockService);
      mockConnectionsService.getUserConnection.mockResolvedValue(null);

      await expect(
        service.createActionStep(zapId, userId, data),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getActionStepsOf', () => {
    it('should return all action steps of a zap', async () => {
      const zapId = 1;
      const mockActionSteps = [
        {
          id: 1,
          zap_id: zapId,
          trigger_id: null,
          action_id: 1,
          step_type: 'ACTION',
          step_order: 1,
          connection_id: 1,
          source_step_id: 0,
          payload: { message: 'Hello' },
          created_at: new Date('2021-10-04'),
          updated_at: new Date('2021-10-05'),
        },
        {
          id: 2,
          zap_id: zapId,
          trigger_id: null,
          action_id: 2,
          step_type: 'ACTION',
          step_order: 2,
          connection_id: 2,
          source_step_id: 1,
          payload: { email: 'test@example.com' },
          created_at: new Date('2021-10-04'),
          updated_at: new Date('2021-10-05'),
        },
      ];

      mockPrismaService.zap_steps.findMany.mockResolvedValue(mockActionSteps);

      const result = await service.getActionStepsOf(zapId);

      expect(result).toHaveLength(2);
      expect(result[0].step_type).toBe('ACTION');
      expect(result[1].step_type).toBe('ACTION');
      expect(mockPrismaService.zap_steps.findMany).toHaveBeenCalledWith({
        where: {
          zap_id: zapId,
          step_type: 'ACTION',
        },
        orderBy: {
          step_order: 'asc',
        },
      });
    });

    it('should return empty array when no action steps exist', async () => {
      mockPrismaService.zap_steps.findMany.mockResolvedValue([]);

      const result = await service.getActionStepsOf(1);

      expect(result).toEqual([]);
    });
  });

  describe('getActionStepById', () => {
    it('should return a specific action step', async () => {
      const zapId = 1;
      const actionId = 1;
      const mockActionStep = {
        id: actionId,
        zap_id: zapId,
        trigger_id: null,
        action_id: 1,
        step_type: 'ACTION',
        step_order: 1,
        connection_id: 1,
        source_step_id: 0,
        payload: { message: 'Hello' },
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-05'),
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockActionStep);

      const result = await service.getActionStepById(zapId, actionId);

      expect(result).toEqual({
        id: actionId,
        zap_id: zapId,
        action_id: 1,
        trigger_id: null,
        connection_id: 1,
        step_type: 'ACTION',
        step_order: 1,
        created_at: mockActionStep.created_at,
        updated_at: mockActionStep.updated_at,
        payload: { message: 'Hello' },
      });
      expect(mockPrismaService.zap_steps.findFirst).toHaveBeenCalledWith({
        where: {
          id: actionId,
          zap_id: zapId,
          step_type: 'ACTION',
        },
      });
    });

    it('should throw NotFoundException when action step not found', async () => {
      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);

      await expect(service.getActionStepById(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteActionStep', () => {
    it('should delete action step', async () => {
      const zapId = 1;
      const actionId = 1;
      const userId = 1;
      const mockStep = {
        id: actionId,
        zap_id: zapId,
        step_type: 'ACTION',
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.zap_steps.delete.mockResolvedValue(mockStep);

      await service.deleteActionStep(zapId, actionId, userId);

      expect(mockPrismaService.zap_steps.findFirst).toHaveBeenCalledWith({
        where: {
          id: actionId,
          zap_id: zapId,
          step_type: 'ACTION',
        },
      });
      expect(mockPrismaService.zap_steps.delete).toHaveBeenCalledWith({
        where: { id: mockStep.id },
      });
    });

    it('should throw NotFoundException when action step not found', async () => {
      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);

      await expect(service.deleteActionStep(1, 999, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.zap_steps.delete).not.toHaveBeenCalled();
    });
  });

  describe('updateActionStep', () => {
    it('should update action with new actionId', async () => {
      const zapId = 1;
      const actionId = 1;
      const userId = 1;
      const data = {
        actionId: 2,
        accountIdentifier: 'discord-456',
        payload: { message: 'Updated' },
        stepOrder: 2,
      };

      const mockStep = {
        id: actionId,
        zap_id: zapId,
        action_id: 1,
        step_type: 'ACTION',
        step_order: 1,
      };

      const mockAction = {
        id: 2,
        service_id: 2,
        name: 'Send DM',
        description: 'Send direct message',
        created_at: new Date(),
      };

      const mockService = {
        id: 2,
        name: 'Discord',
        service_color: '#5865F2',
        icon_url: '/assets/discord.png',
        api_base_url: 'https://discord.com/api',
        auth_type: 'oauth2',
        documentation_url: 'https://discord.com/developers/docs',
        is_active: true,
        created_at: new Date(),
      };

      const mockConnection = {
        id: 2,
        user_id: userId,
        service_id: 2,
        connection_name: 'Discord',
        account_identifier: 'discord-456',
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: null,
        rate_limit_remaining: null,
        rate_limit_reset: null,
        scopes: 'messages',
        is_active: true,
        created_at: new Date(),
        last_used_at: null,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.actions.findUnique.mockResolvedValue(mockAction);
      mockServicesService.getServiceById.mockResolvedValue(mockService);
      mockConnectionsService.getUserConnection.mockResolvedValue(mockConnection);
      mockPrismaService.zap_steps.update.mockResolvedValue({
        ...mockStep,
        action_id: data.actionId,
        connection_id: mockConnection.id,
        payload: data.payload,
        step_order: data.stepOrder,
      });

      await service.updateActionStep(zapId, actionId, userId, data);

      expect(mockPrismaService.zap_steps.update).toHaveBeenCalledWith({
        where: { id: mockStep.id },
        data: {
          action_id: data.actionId,
          connection_id: mockConnection.id,
          payload: data.payload,
          step_order: data.stepOrder,
        },
      });
    });

    it('should update only payload and stepOrder', async () => {
      const zapId = 1;
      const actionId = 1;
      const userId = 1;
      const data = {
        payload: { message: 'New message' },
        stepOrder: 3,
      };

      const mockStep = {
        id: actionId,
        zap_id: zapId,
        action_id: 1,
        step_type: 'ACTION',
        step_order: 1,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.zap_steps.update.mockResolvedValue({
        ...mockStep,
        payload: data.payload,
        step_order: data.stepOrder,
      });

      await service.updateActionStep(zapId, actionId, userId, data);

      expect(mockPrismaService.zap_steps.update).toHaveBeenCalledWith({
        where: { id: mockStep.id },
        data: {
          payload: data.payload,
          step_order: data.stepOrder,
        },
      });
    });

    it('should throw NotFoundException when action step not found', async () => {
      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);

      await expect(
        service.updateActionStep(1, 999, 1, { payload: {} }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when new action not found', async () => {
      const mockStep = {
        id: 1,
        zap_id: 1,
        action_id: 1,
        step_type: 'ACTION',
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.actions.findUnique.mockResolvedValue(null);

      await expect(
        service.updateActionStep(1, 1, 1, { actionId: 999 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when step not found', async () => {
      mockPrismaService.zap_steps.findFirst.mockResolvedValue(null);

      await expect(
        service.updateActionStep(1, 1, 2, { payload: {} }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update only accountIdentifier without actionId', async () => {
      const zapId = 1;
      const userId = 1;
      const stepOrder = 2;
      const data = {
        accountIdentifier: 'gmail-new',
      };

      const mockStep = {
        id: 3,
        zap_id: zapId,
        action_id: 1,
        step_type: 'ACTION',
        step_order: stepOrder,
      };

      const mockAction = {
        id: 1,
        service_id: 1,
        action_type: 'email',
        name: 'Send Email',
        description: 'Send an email',
        created_at: new Date(),
      };

      const mockService = {
        id: 1,
        name: 'Gmail',
        service_color: '#EA4335',
        icon_url: '/assets/gmail.png',
        api_base_url: 'https://gmail.googleapis.com',
        auth_type: 'oauth2',
        documentation_url: 'https://developers.google.com/gmail',
        is_active: true,
        created_at: new Date(),
      };

      const mockConnection = {
        id: 5,
        user_id: userId,
        service_id: 1,
        connection_name: 'Gmail',
        account_identifier: 'gmail-new',
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: null,
        rate_limit_remaining: null,
        rate_limit_reset: null,
        scopes: 'email',
        is_active: true,
        created_at: new Date(),
        last_used_at: null,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.actions.findUnique.mockResolvedValue(mockAction);
      mockPrismaService.services.findUnique.mockResolvedValue(mockService);
      mockConnectionsService.getUserConnection.mockResolvedValue(
        mockConnection,
      );
      mockPrismaService.zap_steps.update.mockResolvedValue({
        ...mockStep,
        connection_id: mockConnection.id,
      });

      await service.updateActionStep(zapId, userId, stepOrder, data);

      expect(mockPrismaService.zap_steps.update).toHaveBeenCalledWith({
        where: { id: mockStep.id },
        data: {
          connection_id: mockConnection.id,
        },
      });
    });

    it('should throw NotFoundException when current action not found for accountIdentifier update', async () => {
      const mockStep = {
        id: 3,
        zap_id: 1,
        action_id: 1,
        step_type: 'ACTION',
        step_order: 2,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.actions.findUnique.mockResolvedValue(null);

      await expect(
        service.updateActionStep(1, 1, 2, { accountIdentifier: 'test-123' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateActionStep(1, 1, 2, { accountIdentifier: 'test-123' }),
      ).rejects.toThrow('Current action not found.');
    });

    it('should throw NotFoundException when service not found for accountIdentifier update', async () => {
      const mockStep = {
        id: 3,
        zap_id: 1,
        action_id: 1,
        step_type: 'ACTION',
        step_order: 2,
      };

      const mockAction = {
        id: 1,
        service_id: 999,
        action_type: 'email',
        name: 'Test',
        description: 'Test',
        created_at: new Date(),
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.actions.findUnique.mockResolvedValue(mockAction);
      mockServicesService.getServiceById.mockRejectedValue(
        new NotFoundException('Service with id 999 do not exists.'),
      );

      await expect(
        service.updateActionStep(1, 1, 2, { accountIdentifier: 'test-123' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when connection not found for accountIdentifier update', async () => {
      const mockStep = {
        id: 3,
        zap_id: 1,
        action_id: 1,
        step_type: 'ACTION',
        step_order: 2,
      };

      const mockAction = {
        id: 1,
        service_id: 1,
        action_type: 'email',
        name: 'Test',
        description: 'Test',
        created_at: new Date(),
      };

      const mockService = {
        id: 1,
        name: 'Gmail',
        service_color: '#EA4335',
        icon_url: '/assets/gmail.png',
        api_base_url: 'https://gmail.googleapis.com',
        auth_type: 'oauth2',
        documentation_url: 'https://developers.google.com/gmail',
        is_active: true,
        created_at: new Date(),
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.actions.findUnique.mockResolvedValue(mockAction);
      mockPrismaService.services.findUnique.mockResolvedValue(mockService);
      mockConnectionsService.getUserConnection.mockResolvedValue(null);

      await expect(
        service.updateActionStep(1, 1, 2, { accountIdentifier: 'nonexistent' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when action not found for actionId update', async () => {
      const mockStep = {
        id: 3,
        zap_id: 1,
        action_id: 1,
        step_type: 'ACTION',
        step_order: 2,
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.actions.findUnique.mockResolvedValue(null);

      await expect(
        service.updateActionStep(1, 1, 2, { actionId: 999 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when service not found for actionId update', async () => {
      const mockStep = {
        id: 3,
        zap_id: 1,
        action_id: 1,
        step_type: 'ACTION',
        step_order: 2,
      };

      const mockAction = {
        id: 2,
        service_id: 999,
        action_type: 'email',
        name: 'Test',
        description: 'Test',
        created_at: new Date(),
      };

      mockPrismaService.zap_steps.findFirst.mockResolvedValue(mockStep);
      mockPrismaService.actions.findUnique.mockResolvedValue(mockAction);
      mockServicesService.getServiceById.mockRejectedValue(
        new NotFoundException('Service with id 999 do not exists.'),
      );

      await expect(
        service.updateActionStep(1, 1, 2, { actionId: 2 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});


