import { Test, TestingModule } from '@nestjs/testing';
import { AboutJsonController } from './aboutJson.controller';
import { AboutJsonService } from './aboutJson.service';
import type { Request } from 'express';
import type { AboutJsonResponseDTO } from './aboutJson.dto';

describe('AboutJsonController', () => {
  let controller: AboutJsonController;
  let service: AboutJsonService;

  const mockAboutJsonService = {
    getAboutJson: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutJsonController],
      providers: [
        {
          provide: AboutJsonService,
          useValue: mockAboutJsonService,
        },
      ],
    }).compile();

    controller = module.get<AboutJsonController>(AboutJsonController);
    service = module.get<AboutJsonService>(AboutJsonService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAboutJson', () => {
    it('should return about.json response', async () => {
      const mockResponse: AboutJsonResponseDTO = {
        client: {
          host: '127.0.0.1',
        },
        server: {
          current_time: 1633024800,
          services: [
            {
              name: 'github',
              actions: [
                {
                  name: 'on_push',
                  description: 'Triggered on push',
                },
              ],
              reactions: [
                {
                  name: 'create_issue',
                  description: 'Create a new issue',
                },
              ],
            },
          ],
        },
      };

      mockAboutJsonService.getAboutJson.mockResolvedValue(mockResponse);

      const mockRequest = {
        ip: '127.0.0.1',
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as unknown as Request;

      const result = await controller.getAboutJson(mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockAboutJsonService.getAboutJson).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(mockAboutJsonService.getAboutJson).toHaveBeenCalledTimes(1);
    });

    it('should call service with correct request object', async () => {
      const mockResponse: AboutJsonResponseDTO = {
        client: {
          host: '192.168.1.1',
        },
        server: {
          current_time: 1633024800,
          services: [],
        },
      };

      mockAboutJsonService.getAboutJson.mockResolvedValue(mockResponse);

      const mockRequest = {
        ip: '192.168.1.1',
        socket: {
          remoteAddress: '192.168.1.1',
        },
        headers: {
          'user-agent': 'test-agent',
        },
      } as unknown as Request;

      await controller.getAboutJson(mockRequest);

      expect(mockAboutJsonService.getAboutJson).toHaveBeenCalledWith(
        mockRequest,
      );
    });

    it('should handle service errors', async () => {
      mockAboutJsonService.getAboutJson.mockRejectedValue(
        new Error('Service error'),
      );

      const mockRequest = {
        ip: '127.0.0.1',
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as unknown as Request;

      await expect(controller.getAboutJson(mockRequest)).rejects.toThrow(
        'Service error',
      );
    });

    it('should return response with multiple services', async () => {
      const mockResponse: AboutJsonResponseDTO = {
        client: {
          host: '10.0.0.1',
        },
        server: {
          current_time: 1633024800,
          services: [
            {
              name: 'github',
              actions: [
                {
                  name: 'on_push',
                  description: 'Triggered on push',
                },
              ],
              reactions: [
                {
                  name: 'create_issue',
                  description: 'Create a new issue',
                },
              ],
            },
            {
              name: 'discord',
              actions: [
                {
                  name: 'on_message',
                  description: 'Triggered on message',
                },
              ],
              reactions: [
                {
                  name: 'send_message',
                  description: 'Send a message',
                },
              ],
            },
          ],
        },
      };

      mockAboutJsonService.getAboutJson.mockResolvedValue(mockResponse);

      const mockRequest = {
        ip: '10.0.0.1',
        socket: {
          remoteAddress: '10.0.0.1',
        },
      } as unknown as Request;

      const result = await controller.getAboutJson(mockRequest);

      expect(result).toEqual(mockResponse);
      expect(result.server.services).toHaveLength(2);
    });

    it('should handle empty services array', async () => {
      const mockResponse: AboutJsonResponseDTO = {
        client: {
          host: '127.0.0.1',
        },
        server: {
          current_time: 1633024800,
          services: [],
        },
      };

      mockAboutJsonService.getAboutJson.mockResolvedValue(mockResponse);

      const mockRequest = {
        ip: '127.0.0.1',
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as unknown as Request;

      const result = await controller.getAboutJson(mockRequest);

      expect(result).toEqual(mockResponse);
      expect(result.server.services).toEqual([]);
    });
  });
});
