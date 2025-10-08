import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@root/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    users: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    services: {
      findFirst: jest.fn(),
    },
    connections: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when user not found', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      const result = await service.getUserById(999);

      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found by email', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      const result = await service.getUserByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user and a scheduling connection', async () => {
      const mockService = {
        id: 1,
        name: 'Scheduling',
      };

      const mockUser = {
        id: 1,
        email: 'newuser@example.com',
        name: 'New User',
        password: 'hashedPassword',
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      mockPrismaService.services.findFirst.mockResolvedValue(mockService);
      mockPrismaService.users.create.mockResolvedValue(mockUser);
      mockPrismaService.connections.create.mockResolvedValue({});

      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'hashedPassword',
      };

      const result = await service.createUser(userData);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.services.findFirst).toHaveBeenCalledWith({
        where: { name: 'Scheduling' },
      });
      expect(mockPrismaService.users.create).toHaveBeenCalledWith({
        data: userData,
      });
      expect(mockPrismaService.connections.create).toHaveBeenCalledWith({
        data: {
          service_id: 1,
          user_id: 1,
          account_identifier: 'SCHEDULE',
          access_token: 'XXXX',
          connection_name: 'SCHEDULE',
          is_active: true,
        },
      });
    });

    it('should use service id 1 if scheduling service not found', async () => {
      const mockUser = {
        id: 1,
        email: 'newuser@example.com',
        name: 'New User',
        password: 'hashedPassword',
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      mockPrismaService.services.findFirst.mockResolvedValue(null);
      mockPrismaService.users.create.mockResolvedValue(mockUser);
      mockPrismaService.connections.create.mockResolvedValue({});

      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'hashedPassword',
      };

      await service.createUser(userData);

      expect(mockPrismaService.connections.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          service_id: 1,
        }),
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const mockUser = {
        id: 1,
        email: 'updated@example.com',
        name: 'Updated User',
        password: 'hashedPassword',
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-05'),
      };

      mockPrismaService.users.update.mockResolvedValue(mockUser);

      const result = await service.updateUser(
        { id: 1 },
        { email: 'updated@example.com', name: 'Updated User' },
      );

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.users.update).toHaveBeenCalledWith({
        data: { email: 'updated@example.com', name: 'Updated User' },
        where: { id: 1 },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockUser = {
        id: 1,
        email: 'deleted@example.com',
        name: 'Deleted User',
        password: 'hashedPassword',
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      mockPrismaService.users.delete.mockResolvedValue(mockUser);

      const result = await service.deleteUser({ id: 1 });

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.users.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
