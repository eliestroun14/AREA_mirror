import { Test, TestingModule } from '@nestjs/testing';
import { TriggersService } from './triggers.service';
import { PrismaService } from '@root/prisma/prisma.service';

describe('TriggersService', () => {
  let service: TriggersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    triggers: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TriggersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TriggersService>(TriggersService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTriggerById', () => {
    it('should return a trigger by id', async () => {
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

      mockPrismaService.triggers.findUnique.mockResolvedValue(mockTrigger);

      const result = await service.getTriggerById(1);

      expect(result).toEqual(mockTrigger);
      expect(mockPrismaService.triggers.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when trigger not found', async () => {
      mockPrismaService.triggers.findUnique.mockResolvedValue(null);

      const result = await service.getTriggerById(999);

      expect(result).toBeNull();
      expect(mockPrismaService.triggers.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('should call prisma with correct parameters', async () => {
      mockPrismaService.triggers.findUnique.mockResolvedValue(null);

      await service.getTriggerById(42);

      expect(mockPrismaService.triggers.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.triggers.findUnique).toHaveBeenCalledWith({
        where: { id: 42 },
      });
    });
  });
});
