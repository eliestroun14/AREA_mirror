import { Test, TestingModule } from '@nestjs/testing';
import { TriggersController } from './triggers.controller';

describe('TriggersController', () => {
  let controller: TriggersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TriggersController],
    }).compile();

    controller = module.get<TriggersController>(TriggersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
