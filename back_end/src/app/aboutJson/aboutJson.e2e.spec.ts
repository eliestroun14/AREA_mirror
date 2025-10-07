import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AboutJsonModule } from './aboutJson.module';
import { PrismaService } from '@root/prisma/prisma.service';

describe('AboutJsonController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const mockPrismaService = {
    services: {
      findMany: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AboutJsonModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // Mock data for testing
    mockPrismaService.services.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'github',
        description: 'GitHub service',
        actions: [
          {
            id: 1,
            name: 'create_issue',
            description: 'Create a new issue',
            serviceId: 1,
          },
        ],
        triggers: [
          {
            id: 1,
            name: 'on_push',
            description: 'Triggered on push',
            serviceId: 1,
          },
        ],
      },
      {
        id: 2,
        name: 'discord',
        description: 'Discord service',
        actions: [
          {
            id: 2,
            name: 'send_message',
            description: 'Send a message',
            serviceId: 2,
          },
        ],
        triggers: [
          {
            id: 2,
            name: 'on_message',
            description: 'Triggered on message',
            serviceId: 2,
          },
        ],
      },
    ]);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/about.json (GET)', () => {
    it('should return 200 and valid about.json structure', () => {
      return request(app.getHttpServer())
        .get('/about.json')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('client');
          expect(res.body).toHaveProperty('server');
          expect(res.body.client).toHaveProperty('host');
          expect(res.body.server).toHaveProperty('current_time');
          expect(res.body.server).toHaveProperty('services');
          expect(Array.isArray(res.body.server.services)).toBe(true);
        });
    });

    it('should return client host information', () => {
      return request(app.getHttpServer())
        .get('/about.json')
        .expect(200)
        .expect((res) => {
          expect(typeof res.body.client.host).toBe('string');
        });
    });

    it('should return current_time as Unix timestamp', () => {
      const beforeTimestamp = Math.floor(Date.now() / 1000);

      return request(app.getHttpServer())
        .get('/about.json')
        .expect(200)
        .expect((res) => {
          const currentTime = res.body.server.current_time;
          expect(typeof currentTime).toBe('number');
          expect(currentTime).toBeGreaterThanOrEqual(beforeTimestamp);
          expect(currentTime).toBeLessThanOrEqual(
            Math.floor(Date.now() / 1000) + 1,
          );
        });
    });

    it('should return services array with correct structure', () => {
      return request(app.getHttpServer())
        .get('/about.json')
        .expect(200)
        .expect((res) => {
          const services = res.body.server.services;
          expect(Array.isArray(services)).toBe(true);

          if (services.length > 0) {
            services.forEach((service: any) => {
              expect(service).toHaveProperty('name');
              expect(service).toHaveProperty('actions');
              expect(service).toHaveProperty('reactions');
              expect(Array.isArray(service.actions)).toBe(true);
              expect(Array.isArray(service.reactions)).toBe(true);

              service.actions.forEach((action: any) => {
                expect(action).toHaveProperty('name');
                expect(action).toHaveProperty('description');
              });

              service.reactions.forEach((reaction: any) => {
                expect(reaction).toHaveProperty('name');
                expect(reaction).toHaveProperty('description');
              });
            });
          }
        });
    });

    it('should return Content-Type application/json', () => {
      return request(app.getHttpServer())
        .get('/about.json')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should handle requests from different IPs', async () => {
      const response1 = await request(app.getHttpServer())
        .get('/about.json')
        .set('X-Forwarded-For', '192.168.1.100')
        .expect(200);

      expect(response1.body.client).toHaveProperty('host');

      const response2 = await request(app.getHttpServer())
        .get('/about.json')
        .set('X-Forwarded-For', '10.0.0.1')
        .expect(200);

      expect(response2.body.client).toHaveProperty('host');
    });

    it('should return consistent structure on multiple calls', async () => {
      const response1 = await request(app.getHttpServer())
        .get('/about.json')
        .expect(200);

      const response2 = await request(app.getHttpServer())
        .get('/about.json')
        .expect(200);

      // Structure should be identical
      expect(Object.keys(response1.body)).toEqual(Object.keys(response2.body));
      expect(Object.keys(response1.body.client)).toEqual(
        Object.keys(response2.body.client),
      );
      expect(Object.keys(response1.body.server)).toEqual(
        Object.keys(response2.body.server),
      );

      // Services should be the same (assuming no DB changes between calls)
      expect(response1.body.server.services).toEqual(
        response2.body.server.services,
      );
    });

    it('should handle requests with different HTTP methods correctly', async () => {
      // GET should work
      await request(app.getHttpServer()).get('/about.json').expect(200);

      // POST should not be allowed (if not defined)
      await request(app.getHttpServer()).post('/about.json').expect(404);

      // PUT should not be allowed (if not defined)
      await request(app.getHttpServer()).put('/about.json').expect(404);

      // DELETE should not be allowed (if not defined)
      await request(app.getHttpServer()).delete('/about.json').expect(404);
    });

    it('should return valid JSON that can be parsed', () => {
      return request(app.getHttpServer())
        .get('/about.json')
        .expect(200)
        .expect((res) => {
          // If response can be accessed, it means JSON was properly parsed
          expect(() => JSON.parse(JSON.stringify(res.body))).not.toThrow();
        });
    });
  });
});
