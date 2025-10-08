import { Test, TestingModule } from '@nestjs/testing';
import { Oauth2Service } from './oauth2.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

describe('Oauth2Service', () => {
  let service: Oauth2Service;
  let prismaService: PrismaService;
  let servicesService: ServicesService;

  const mockPrismaService = {
    connections: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockServicesService = {
    getServiceByName: jest.fn(),
    getAllServices: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Oauth2Service,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ServicesService, useValue: mockServicesService },
      ],
    }).compile();

    service = module.get<Oauth2Service>(Oauth2Service);
    prismaService = module.get<PrismaService>(PrismaService);
    servicesService = module.get<ServicesService>(ServicesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have prismaService injected', () => {
    expect(prismaService).toBeDefined();
  });

  it('should have servicesService injected', () => {
    expect(servicesService).toBeDefined();
  });

  describe('Service dependencies', () => {
    it('should be able to access PrismaService', () => {
      expect(service['prisma']).toBe(prismaService);
    });

    it('should be able to access ServicesService', () => {
      expect(service['servicesService']).toBe(servicesService);
    });
  });
});
