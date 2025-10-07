import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './services.controller';
import { ServicesService } from './services.service';
import { NotFoundException } from '@nestjs/common';

describe('ServiceController', () => {
  let controller: ServiceController;
  let service: ServicesService;

  const mockServicesService = {
    getAllServices: jest.fn(),
    getServiceById: jest.fn(),
    getServiceByName: jest.fn(),
    getTriggersByService: jest.fn(),
    getActionsByService: jest.fn(),
    getActionByService: jest.fn(),
    getTriggerByService: jest.fn(),
    searchServices: jest.fn(),
    searchTriggers: jest.fn(),
    searchActions: jest.fn(),
    searchAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [{ provide: ServicesService, useValue: mockServicesService }],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
    service = module.get<ServicesService>(ServicesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllServices', () => {
    it('should return all services', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'github',
          icon_url: '/assets/github.png',
          api_base_url: 'https://api.github.com',
          services_color: '#181717',
          auth_type: 'oauth2',
          documentation_url: 'https://docs.github.com',
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
      ];

      mockServicesService.getAllServices.mockResolvedValue(mockServices);

      const result = await controller.getAllServices();

      expect(result).toEqual(mockServices);
      expect(mockServicesService.getAllServices).toHaveBeenCalledTimes(1);
    });
  });

  describe('getService', () => {
    it('should return a service by id', async () => {
      const mockService = {
        id: 1,
        name: 'github',
        icon_url: '/assets/github.png',
        api_base_url: 'https://api.github.com',
        services_color: '#181717',
        auth_type: 'oauth2',
        documentation_url: 'https://docs.github.com',
        is_active: true,
        created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
      };

      mockServicesService.getServiceById.mockResolvedValue(mockService);

      const result = await controller.getService({ serviceId: '1' });

      expect(result).toEqual(mockService);
      expect(mockServicesService.getServiceById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for invalid serviceId', async () => {
      await expect(
        controller.getService({ serviceId: 'invalid' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTriggersByService', () => {
    it('should return triggers for a service', async () => {
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
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
          updated_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
      ];

      mockServicesService.getTriggersByService.mockResolvedValue(mockTriggers);

      const result = await controller.getTriggersByService({ serviceId: '1' });

      expect(result).toEqual(mockTriggers);
      expect(mockServicesService.getTriggersByService).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for invalid serviceId', async () => {
      await expect(
        controller.getTriggersByService({ serviceId: 'invalid' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getActionsByService', () => {
    it('should return actions for a service', async () => {
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
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
          updated_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
      ];

      mockServicesService.getActionsByService.mockResolvedValue(mockActions);

      const result = await controller.getActionsByService({ serviceId: '1' });

      expect(result).toEqual(mockActions);
      expect(mockServicesService.getActionsByService).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for invalid serviceId', async () => {
      await expect(
        controller.getActionsByService({ serviceId: 'invalid' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getActionByService', () => {
    it('should return a specific action', async () => {
      const mockAction = {
        id: 1,
        service_id: 1,
        http_request_id: 1,
        name: 'Create Issue',
        description: 'Creates a new issue',
        fields: {},
        variables: {},
        is_active: true,
        created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        updated_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
      };

      mockServicesService.getActionByService.mockResolvedValue(mockAction);

      const result = await controller.getActionByService({
        serviceId: '1',
        actionId: '1',
      });

      expect(result).toEqual(mockAction);
      expect(mockServicesService.getActionByService).toHaveBeenCalledWith(
        1,
        1,
      );
    });

    it('should throw NotFoundException for invalid serviceId', async () => {
      await expect(
        controller.getActionByService({ serviceId: 'invalid', actionId: '1' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for invalid actionId', async () => {
      await expect(
        controller.getActionByService({ serviceId: '1', actionId: 'invalid' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTriggerByService', () => {
    it('should return a specific trigger', async () => {
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
        created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        updated_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
      };

      mockServicesService.getTriggerByService.mockResolvedValue(mockTrigger);

      const result = await controller.getTriggerByService({
        serviceId: '1',
        triggerId: '1',
      });

      expect(result).toEqual(mockTrigger);
      expect(mockServicesService.getTriggerByService).toHaveBeenCalledWith(
        1,
        1,
      );
    });

    it('should throw NotFoundException for invalid serviceId', async () => {
      await expect(
        controller.getTriggerByService({
          serviceId: 'invalid',
          triggerId: '1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for invalid triggerId', async () => {
      await expect(
        controller.getTriggerByService({
          serviceId: '1',
          triggerId: 'invalid',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchServices', () => {
    it('should search services by query', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'github',
          icon_url: '/assets/github.png',
          api_base_url: 'https://api.github.com',
          services_color: '#181717',
          auth_type: 'oauth2',
          documentation_url: 'https://docs.github.com',
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
      ];

      mockServicesService.searchServices.mockResolvedValue(mockServices);

      const result = await controller.searchServices('git');

      expect(result).toEqual(mockServices);
      expect(mockServicesService.searchServices).toHaveBeenCalledWith(
        'git',
        undefined,
        undefined,
      );
    });

    it('should support pagination in search', async () => {
      mockServicesService.searchServices.mockResolvedValue([]);

      await controller.searchServices('test', '0', '10');

      expect(mockServicesService.searchServices).toHaveBeenCalledWith(
        'test',
        0,
        10,
      );
    });
  });

  describe('searchTriggers', () => {
    it('should search services by trigger name', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'github',
          icon_url: '/assets/github.png',
          api_base_url: 'https://api.github.com',
          services_color: '#181717',
          auth_type: 'oauth2',
          documentation_url: 'https://docs.github.com',
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
      ];

      mockServicesService.searchTriggers.mockResolvedValue(mockServices);

      const result = await controller.searchTriggers('push');

      expect(result).toEqual(mockServices);
      expect(mockServicesService.searchTriggers).toHaveBeenCalledWith(
        'push',
        undefined,
        undefined,
      );
    });
  });

  describe('searchActions', () => {
    it('should search services by action name', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'github',
          icon_url: '/assets/github.png',
          api_base_url: 'https://api.github.com',
          services_color: '#181717',
          auth_type: 'oauth2',
          documentation_url: 'https://docs.github.com',
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
      ];

      mockServicesService.searchActions.mockResolvedValue(mockServices);

      const result = await controller.searchActions('create');

      expect(result).toEqual(mockServices);
      expect(mockServicesService.searchActions).toHaveBeenCalledWith(
        'create',
        undefined,
        undefined,
      );
    });
  });

  describe('searchAll', () => {
    it('should search across all types', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'github',
          icon_url: '/assets/github.png',
          api_base_url: 'https://api.github.com',
          services_color: '#181717',
          auth_type: 'oauth2',
          documentation_url: 'https://docs.github.com',
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
      ];

      mockServicesService.searchAll.mockResolvedValue(mockServices);

      const result = await controller.searchAll('github');

      expect(result).toEqual(mockServices);
      expect(mockServicesService.searchAll).toHaveBeenCalledWith(
        'github',
        undefined,
        undefined,
      );
    });
  });
});
