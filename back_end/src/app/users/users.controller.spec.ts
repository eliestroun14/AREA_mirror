import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { ActivityService } from './activity/activity.service';
import { UsersService } from './users.service';
import { ConnectionsService } from './connections/connections.service';
import { ForbiddenException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let connectionsService: ConnectionsService;

  const mockUsersService = {
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockConnectionsService = {
    getAllUserConnections: jest.fn(),
    getUserConnectionsByService: jest.fn(),
  };

  const mockActivityService = {
    getActivitiesForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConnectionsService, useValue: mockConnectionsService },
        { provide: ActivityService, useValue: mockActivityService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    connectionsService = module.get<ConnectionsService>(ConnectionsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      const mockRequest = {
        user: { userId: 1, email: 'test@example.com' },
      } as any;

      mockUsersService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getMe(mockRequest);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        created_at: mockUser.created_at.toUTCString(),
        updated_at: mockUser.updated_at.toUTCString(),
      });
      expect(mockUsersService.getUserById).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException if user not found', async () => {
      const mockRequest = {
        user: { userId: 1, email: 'test@example.com' },
      } as any;

      mockUsersService.getUserById.mockResolvedValue(null);

      await expect(controller.getMe(mockRequest)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(controller.getMe(mockRequest)).rejects.toThrow(
        'You are not authenticated.',
      );
    });
  });

  describe('putMe', () => {
    it('should update user profile', async () => {
      const mockUser = {
        id: 1,
        email: 'updated@example.com',
        name: 'Updated User',
        password: 'hashedPassword',
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-05'),
      };

      const mockRequest = {
        user: { userId: 1, email: 'test@example.com' },
      } as any;

      const body = {
        email: 'updated@example.com',
        name: 'Updated User',
      };

      mockUsersService.updateUser.mockResolvedValue(mockUser);

      const result = await controller.putMe(mockRequest, body);

      expect(result).toEqual({
        id: 1,
        email: 'updated@example.com',
        name: 'Updated User',
        created_at: mockUser.created_at.toUTCString(),
        updated_at: mockUser.updated_at.toUTCString(),
      });
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(
        { id: 1 },
        { email: 'updated@example.com', name: 'Updated User' },
      );
    });
  });

  describe('deleteMe', () => {
    it('should delete user account', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        created_at: new Date('2021-10-04'),
        updated_at: new Date('2021-10-04'),
      };

      const mockRequest = {
        user: { userId: 1, email: 'test@example.com' },
      } as any;

      mockUsersService.deleteUser.mockResolvedValue(mockUser);

      const result = await controller.deleteMe(mockRequest);

      expect(result).toEqual({
        message: 'Your account has been deleted.',
        statusCode: HttpStatus.NO_CONTENT,
      });
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('logoutMe', () => {
    it('should clear cookies and return success message', () => {
      const mockResponse = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      controller.logoutMe(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('session_token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'You have been successfully logged out.',
        statusCode: HttpStatus.OK,
      });
    });
  });

  describe('getAllConnections', () => {
    it('should return all user connections', async () => {
      const mockConnections = [
        {
          id: 1,
          user_id: 1,
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
          created_at: new Date('2021-10-04'),
          last_used_at: new Date('2021-10-05'),
          service: {
            id: 1,
            name: 'GitHub',
            service_color: '#181717',
            icon_url: '/assets/github.png',
            api_base_url: 'https://api.github.com',
            auth_type: 'oauth2',
            documentation_url: 'https://docs.github.com',
            is_active: true,
            created_at: new Date('2021-10-04'),
          },
        },
      ];

      const mockRequest = {
        user: { userId: 1, email: 'test@example.com' },
      } as any;

      mockConnectionsService.getAllUserConnections.mockResolvedValue(
        mockConnections,
      );

      const result = await controller.getAllConnections(mockRequest);

      expect(result.connections).toHaveLength(1);
      expect(result.connections[0]).toEqual({
        id: 1,
        service_id: 1,
        service_name: 'GitHub',
        service_color: '#181717',
        icon_url: '/assets/github.png',
        connection_name: 'GitHub',
        account_identifier: 'github-123',
        is_active: true,
        created_at: mockConnections[0].created_at.toUTCString(),
        last_used_at: mockConnections[0].last_used_at?.toUTCString(),
      });
      expect(
        mockConnectionsService.getAllUserConnections,
      ).toHaveBeenCalledWith(1);
    });

    it('should handle connections with null last_used_at', async () => {
      const mockConnections = [
        {
          id: 1,
          user_id: 1,
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
          created_at: new Date('2021-10-04'),
          last_used_at: null,
          service: {
            id: 1,
            name: 'GitHub',
            service_color: '#181717',
            icon_url: '/assets/github.png',
            api_base_url: 'https://api.github.com',
            auth_type: 'oauth2',
            documentation_url: 'https://docs.github.com',
            is_active: true,
            created_at: new Date('2021-10-04'),
          },
        },
      ];

      const mockRequest = {
        user: { userId: 1, email: 'test@example.com' },
      } as any;

      mockConnectionsService.getAllUserConnections.mockResolvedValue(
        mockConnections,
      );

      const result = await controller.getAllConnections(mockRequest);

      expect(result.connections[0].last_used_at).toBeNull();
    });
  });

  describe('getConnectionsByService', () => {
    it('should return connections for a specific service', async () => {
      const mockConnections = [
        {
          id: 1,
          user_id: 1,
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
          created_at: new Date('2021-10-04'),
          last_used_at: new Date('2021-10-05'),
          service: {
            id: 1,
            name: 'GitHub',
            service_color: '#181717',
            icon_url: '/assets/github.png',
            api_base_url: 'https://api.github.com',
            auth_type: 'oauth2',
            documentation_url: 'https://docs.github.com',
            is_active: true,
            created_at: new Date('2021-10-04'),
          },
        },
      ];

      const mockRequest = {
        user: { userId: 1, email: 'test@example.com' },
      } as any;

      mockConnectionsService.getUserConnectionsByService.mockResolvedValue(
        mockConnections,
      );

      const result = await controller.getConnectionsByService(mockRequest, 1);

      expect(result.connections).toHaveLength(1);
      expect(result.connections[0].service_name).toBe('GitHub');
      expect(
        mockConnectionsService.getUserConnectionsByService,
      ).toHaveBeenCalledWith(1, 1);
    });
  });
});

