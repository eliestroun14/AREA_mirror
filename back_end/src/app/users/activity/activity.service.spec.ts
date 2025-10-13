import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { PrismaService } from '@root/prisma/prisma.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let prisma: PrismaService;

  const mockPrisma: any = {
    connections: {
      findMany: jest.fn(),
    },
    zap_executions: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return activities aggregated from connections and zap_executions', async () => {
    const connections = [
      {
        id: 1,
        user_id: 1,
        service_id: 2,
        connection_name: 'GitHub',
        account_identifier: 'gh-1',
        created_at: new Date('2021-10-04T00:00:00Z'),
        last_used_at: null,
        service: {
          id: 2,
          name: 'GitHub',
        },
      },
    ];

    const zapExecutions = [
      {
        id: 11,
        zap_id: 5,
        started_at: new Date('2021-10-05T00:00:00Z'),
        duration_ms: 123,
        status: 'done',
        zap: {
          id: 5,
          user_id: 1,
          name: 'My Zap',
        },
      },
    ];

    mockPrisma.connections.findMany.mockResolvedValue(connections);
    mockPrisma.zap_executions.findMany.mockResolvedValue(zapExecutions);

    const activities = await service.getActivitiesForUser(1);

    expect(activities).toBeInstanceOf(Array);
    // zap execution started_at is later -> appears first after sort
    expect(activities[0].type).toBe('zap_execution');
    expect(activities[1].type).toBe('connection');
    // check that meta objects contain the ids
    expect(
      activities.some((a) => a.meta && (a.meta as any).zap_execution_id === 11),
    ).toBe(true);
    expect(
      activities.some((a) => a.meta && (a.meta as any).connection_id === 1),
    ).toBe(true);
  });

  it('should return empty array when no activities', async () => {
    mockPrisma.connections.findMany.mockResolvedValue([]);
    mockPrisma.zap_executions.findMany.mockResolvedValue([]);

    const activities = await service.getActivitiesForUser(999);
    expect(activities).toEqual([]);
  });
});
