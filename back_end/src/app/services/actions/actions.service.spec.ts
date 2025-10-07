import { Test, TestingModule } from '@nestjs/testing';
import { ActionsService } from './actions.service';
import { PrismaService } from '@root/prisma/prisma.service';

describe('ActionsService', () => {
  let service: ActionsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    actions: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ActionsService>(ActionsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getActionById', () => {
    it('should return an action by id', async () => {
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

      mockPrismaService.actions.findUnique.mockResolvedValue(mockAction);

      const result = await service.getActionById(1);

      expect(result).toEqual(mockAction);
      expect(mockPrismaService.actions.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when action not found', async () => {
      mockPrismaService.actions.findUnique.mockResolvedValue(null);

      const result = await service.getActionById(999);

      expect(result).toBeNull();
      expect(mockPrismaService.actions.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('should call prisma with correct parameters', async () => {
      mockPrismaService.actions.findUnique.mockResolvedValue(null);

      await service.getActionById(42);

      expect(mockPrismaService.actions.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.actions.findUnique).toHaveBeenCalledWith({
        where: { id: 42 },
      });
    });
  });
});
