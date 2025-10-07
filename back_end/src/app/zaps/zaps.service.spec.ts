import { Test, TestingModule } from '@nestjs/testing';
import { ZapsService } from './zaps.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ZapsService', () => {
  let service: ZapsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    zaps: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZapsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ZapsService>(ZapsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllZaps', () => {
    it('should return all zaps', async () => {
      const mockZaps = [
        {
          id: 1,
          user_id: 1,
          name: 'Test Zap 1',
          description: 'Description 1',
          is_active: true,
          created_at: new Date('2021-10-04'),
          updated_at: new Date('2021-10-05'),
        },
        {
          id: 2,
          user_id: 2,
          name: 'Test Zap 2',
          description: 'Description 2',
          is_active: false,
          created_at: new Date('2021-10-06'),
          updated_at: new Date('2021-10-07'),
        },
      ];

      mockPrismaService.zaps.findMany.mockResolvedValue(mockZaps);

      const result = await service.getAllZaps();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        user_id: 1,
        name: 'Test Zap 1',
        description: 'Description 1',
        is_active: true,
        created_at: mockZaps[0].created_at.toISOString(),
        updated_at: mockZaps[0].updated_at.toISOString(),
      });
      expect(mockPrismaService.zaps.findMany).toHaveBeenCalledWith();
    });

    it('should return empty array when no zaps exist', async () => {
      mockPrismaService.zaps.findMany.mockResolvedValue([]);

      const result = await service.getAllZaps();

      expect(result).toEqual([]);
    });

    it('should handle zaps with null dates', async () => {
      const mockZaps = [
        {
          id: 1,
          user_id: 1,
          name: 'Test Zap',
          description: 'Description',
          is_active: true,
          created_at: null,
          updated_at: null,
        },
      ];

      mockPrismaService.zaps.findMany.mockResolvedValue(mockZaps);

      const result = await service.getAllZaps();

      expect(result[0].created_at).toBe('');
      expect(result[0].updated_at).toBe('');
    });
  });

  describe('getAllUserZaps', () => {
    it('should return all zaps for a specific user', async () => {
      const userId = 1;
      const mockZaps = [
        {
          id: 1,
          user_id: userId,
          name: 'User Zap 1',
          description: 'Description 1',
          is_active: true,
          created_at: new Date('2021-10-04'),
          updated_at: new Date('2021-10-05'),
        },
        {
          id: 2,
          user_id: userId,
          name: 'User Zap 2',
          description: 'Description 2',
          is_active: false,
          created_at: new Date('2021-10-06'),
          updated_at: new Date('2021-10-07'),
        },
      ];

      mockPrismaService.zaps.findMany.mockResolvedValue(mockZaps);

      const result = await service.getAllUserZaps(userId);

      expect(result).toHaveLength(2);
      expect(result[0].user_id).toBe(userId);
      expect(result[1].user_id).toBe(userId);
      expect(mockPrismaService.zaps.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
    });

    it('should return empty array when user has no zaps', async () => {
      mockPrismaService.zaps.findMany.mockResolvedValue([]);

      const result = await service.getAllUserZaps(999);

      expect(result).toEqual([]);
    });

    it('should handle user zaps with null dates', async () => {
      const mockZaps = [
        {
          id: 1,
          user_id: 1,
          name: 'Test Zap',
          description: 'Description',
          is_active: true,
          created_at: null,
          updated_at: null,
        },
      ];

      mockPrismaService.zaps.findMany.mockResolvedValue(mockZaps);

      const result = await service.getAllUserZaps(1);

      expect(result[0].created_at).toBe('');
      expect(result[0].updated_at).toBe('');
    });
  });

  describe('getZap', () => {
    it('should return a specific zap', async () => {
      const zapId = 1;
      const userId = 1;
      const mockZap = {
        id: zapId,
        user_id: userId,
        name: 'Test Zap',
        description: 'Description',
        is_active: true,
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-05'),
      };

      mockPrismaService.zaps.findFirst.mockResolvedValue(mockZap);

      const result = await service.getZap(zapId, userId);

      expect(result).toEqual({
        id: zapId,
        user_id: userId,
        name: 'Test Zap',
        description: 'Description',
        is_active: true,
        created_at: mockZap.created_at.toISOString(),
        updated_at: mockZap.updated_at.toISOString(),
      });
      expect(mockPrismaService.zaps.findFirst).toHaveBeenCalledWith({
        where: { id: zapId, user_id: userId },
      });
    });

    it('should throw NotFoundException when zap not found', async () => {
      mockPrismaService.zaps.findFirst.mockResolvedValue(null);

      await expect(service.getZap(999, 1)).rejects.toThrow(NotFoundException);
      await expect(service.getZap(999, 1)).rejects.toThrow(
        'Zap with id 999 not found.',
      );
    });

    it('should throw NotFoundException when zap belongs to different user', async () => {
      mockPrismaService.zaps.findFirst.mockResolvedValue(null);

      await expect(service.getZap(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should handle zap with null dates', async () => {
      const mockZap = {
        id: 1,
        user_id: 1,
        name: 'Test Zap',
        description: 'Description',
        is_active: true,
        created_at: null,
        updated_at: null,
      };

      mockPrismaService.zaps.findFirst.mockResolvedValue(mockZap);

      const result = await service.getZap(1, 1);

      expect(result.created_at).toBe('');
      expect(result.updated_at).toBe('');
    });
  });

  describe('createZap', () => {
    it('should create a new zap with provided data', async () => {
      const userId = 1;
      const data = {
        name: 'New Zap',
        description: 'New Description',
      };

      const mockCreatedZap = {
        id: 1,
        user_id: userId,
        name: data.name,
        description: data.description,
        is_active: false,
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      mockPrismaService.zaps.create.mockResolvedValue(mockCreatedZap);

      const result = await service.createZap(userId, data);

      expect(result).toMatchObject({
        id: 1,
        user_id: userId,
        name: data.name,
        description: data.description,
        is_active: false,
      });
      expect(typeof result.created_at).toBe('string');
      expect(typeof result.updated_at).toBe('string');
      expect(mockPrismaService.zaps.create).toHaveBeenCalledWith({
        data: {
          user_id: userId,
          name: data.name,
          description: data.description,
        },
      });
    });

    it('should create a zap with default name when name not provided', async () => {
      const userId = 1;
      const data = {
        description: 'Description only',
      };

      const mockCreatedZap = {
        id: 1,
        user_id: userId,
        name: 'Nouveau Zap',
        description: data.description,
        is_active: false,
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      mockPrismaService.zaps.create.mockResolvedValue(mockCreatedZap);

      const result = await service.createZap(userId, data);

      expect(result.name).toBe('Nouveau Zap');
      expect(mockPrismaService.zaps.create).toHaveBeenCalledWith({
        data: {
          user_id: userId,
          name: 'Nouveau Zap',
          description: data.description,
        },
      });
    });

    it('should create a zap with default description when description not provided', async () => {
      const userId = 1;
      const data = {
        name: 'Name only',
      };

      const mockCreatedZap = {
        id: 1,
        user_id: userId,
        name: data.name,
        description: 'Description du zap',
        is_active: false,
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      mockPrismaService.zaps.create.mockResolvedValue(mockCreatedZap);

      const result = await service.createZap(userId, data);

      expect(result.description).toBe('Description du zap');
      expect(mockPrismaService.zaps.create).toHaveBeenCalledWith({
        data: {
          user_id: userId,
          name: data.name,
          description: 'Description du zap',
        },
      });
    });
  });

  describe('deleteZap', () => {
    it('should delete an existing zap', async () => {
      const zapId = 1;
      const userId = 1;
      const mockZap = {
        id: zapId,
        user_id: userId,
        name: 'Zap to delete',
        description: 'Description',
        is_active: true,
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-05'),
      };

      mockPrismaService.zaps.findFirst.mockResolvedValue(mockZap);
      mockPrismaService.zaps.delete.mockResolvedValue(mockZap);

      await service.deleteZap(zapId, userId);

      expect(mockPrismaService.zaps.findFirst).toHaveBeenCalledWith({
        where: { id: zapId, user_id: userId },
      });
      expect(mockPrismaService.zaps.delete).toHaveBeenCalledWith({
        where: { id: zapId },
      });
    });

    it('should throw NotFoundException when zap to delete not found', async () => {
      mockPrismaService.zaps.findFirst.mockResolvedValue(null);

      await expect(service.deleteZap(999, 1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.deleteZap(999, 1)).rejects.toThrow(
        'Zap with id 999 not found.',
      );
      expect(mockPrismaService.zaps.delete).not.toHaveBeenCalled();
    });
  });

  describe('updateZap', () => {
    it('should update zap name and description', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        name: 'Updated Name',
        description: 'Updated Description',
      };

      const mockExistingZap = {
        id: zapId,
        user_id: userId,
        name: 'Old Name',
        description: 'Old Description',
        is_active: true,
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-05'),
      };

      const mockUpdatedZap = {
        ...mockExistingZap,
        name: data.name,
        description: data.description,
        updated_at: new Date('2021-10-06'),
      };

      mockPrismaService.zaps.findFirst.mockResolvedValue(mockExistingZap);
      mockPrismaService.zaps.update.mockResolvedValue(mockUpdatedZap);

      const result = await service.updateZap(zapId, userId, data);

      expect(result.name).toBe(data.name);
      expect(result.description).toBe(data.description);
      expect(mockPrismaService.zaps.update).toHaveBeenCalledWith({
        where: { id: zapId },
        data: { name: data.name, description: data.description },
      });
    });

    it('should update only name when description not provided', async () => {
      const zapId = 1;
      const userId = 1;
      const data = {
        name: 'Updated Name',
      };

      const mockExistingZap = {
        id: zapId,
        user_id: userId,
        name: 'Old Name',
        description: 'Old Description',
        is_active: true,
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-05'),
      };

      const mockUpdatedZap = {
        ...mockExistingZap,
        name: data.name,
        updated_at: new Date('2021-10-06'),
      };

      mockPrismaService.zaps.findFirst.mockResolvedValue(mockExistingZap);
      mockPrismaService.zaps.update.mockResolvedValue(mockUpdatedZap);

      const result = await service.updateZap(zapId, userId, data);

      expect(result.name).toBe(data.name);
      expect(mockPrismaService.zaps.update).toHaveBeenCalledWith({
        where: { id: zapId },
        data: { name: data.name },
      });
    });

    it('should throw NotFoundException when zap to update not found', async () => {
      mockPrismaService.zaps.findFirst.mockResolvedValue(null);

      await expect(
        service.updateZap(999, 1, { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.zaps.update).not.toHaveBeenCalled();
    });
  });

  describe('toggleZap', () => {
    it('should activate a zap', async () => {
      const zapId = 1;
      const userId = 1;

      const mockExistingZap = {
        is_active: false,
      };

      const mockUpdatedZap = {
        id: zapId,
        user_id: userId,
        name: 'Test Zap',
        description: 'Description',
        is_active: true,
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-05'),
      };

      mockPrismaService.zaps.findFirst.mockResolvedValue(mockExistingZap);
      mockPrismaService.zaps.update.mockResolvedValue(mockUpdatedZap);

      const result = await service.toggleZap(zapId, userId, true);

      expect(result.is_active).toBe(true);
      expect(mockPrismaService.zaps.update).toHaveBeenCalledWith({
        where: { id: zapId },
        data: { is_active: true },
      });
    });

    it('should deactivate a zap', async () => {
      const zapId = 1;
      const userId = 1;

      const mockExistingZap = {
        is_active: true,
      };

      const mockUpdatedZap = {
        id: zapId,
        user_id: userId,
        name: 'Test Zap',
        description: 'Description',
        is_active: false,
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-05'),
      };

      mockPrismaService.zaps.findFirst.mockResolvedValue(mockExistingZap);
      mockPrismaService.zaps.update.mockResolvedValue(mockUpdatedZap);

      const result = await service.toggleZap(zapId, userId, false);

      expect(result.is_active).toBe(false);
      expect(mockPrismaService.zaps.update).toHaveBeenCalledWith({
        where: { id: zapId },
        data: { is_active: false },
      });
    });

    it('should throw NotFoundException when zap to toggle not found', async () => {
      mockPrismaService.zaps.findFirst.mockResolvedValue(null);

      await expect(service.toggleZap(999, 1, true)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.zaps.update).not.toHaveBeenCalled();
    });
  });
});
