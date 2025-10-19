import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from './webhooks.controller';
import { RunnerService } from '@root/runner/runner.service';
import { ZapsService } from '@app/zaps/zaps.service';

describe('WebhooksController', () => {
  let controller: WebhooksController;

  beforeEach(async () => {
    // Mock des services
    const mockWorkflowService = {};
    const mockZapsService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [
        {
          provide: RunnerService,
          useValue: mockWorkflowService,
        },
        {
          provide: ZapsService,
          useValue: mockZapsService,
        },
      ],
    }).compile();

    controller = module.get<WebhooksController>(WebhooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
