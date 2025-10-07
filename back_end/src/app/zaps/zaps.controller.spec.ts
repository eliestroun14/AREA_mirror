import { Test, TestingModule } from '@nestjs/testing';
import { ZapsController } from './zaps.controller';
import { ZapsService } from './zaps.service';
import { StepsService } from './steps/steps.service';

describe('ZapsController', () => {
  let controller: ZapsController;

  const mockZapsService = {
    getAllZaps: jest.fn(),
    getAllUserZaps: jest.fn(),
    getZap: jest.fn(),
    createZap: jest.fn(),
    updateZap: jest.fn(),
    deleteZap: jest.fn(),
    toggleZap: jest.fn(),
  };

  const mockStepsService = {
    createTriggerStep: jest.fn(),
    getTriggerStepOf: jest.fn(),
    updateTriggerStep: jest.fn(),
    deleteTriggerStep: jest.fn(),
    createActionStep: jest.fn(),
    getActionStepsOf: jest.fn(),
    getActionStepById: jest.fn(),
    updateActionStep: jest.fn(),
    deleteActionStep: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZapsController],
      providers: [
        { provide: ZapsService, useValue: mockZapsService },
        { provide: StepsService, useValue: mockStepsService },
      ],
    }).compile();

    controller = module.get<ZapsController>(ZapsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CRUD Operations', () => {
    it('should have getAllZaps method', () => {
      expect(controller.getAllZaps).toBeDefined();
    });

    it('should have getZap method', () => {
      expect(controller.getZap).toBeDefined();
    });

    it('should have createZap method', () => {
      expect(controller.createZap).toBeDefined();
    });

    it('should have updateZap method', () => {
      expect(controller.updateZap).toBeDefined();
    });

    it('should have deleteZap method', () => {
      expect(controller.deleteZap).toBeDefined();
    });

    it('should have toggleZap method', () => {
      expect(controller.toggleZap).toBeDefined();
    });
  });

  describe('Trigger Operations', () => {
    it('should have createZapTrigger method', () => {
      expect(controller.createZapTrigger).toBeDefined();
    });

    it('should have getZapTrigger method', () => {
      expect(controller.getZapTrigger).toBeDefined();
    });

    it('should have updateZapTrigger method', () => {
      expect(controller.updateZapTrigger).toBeDefined();
    });

    it('should have deleteZapTrigger method', () => {
      expect(controller.deleteZapTrigger).toBeDefined();
    });
  });

  describe('Action Operations', () => {
    it('should have createZapAction method', () => {
      expect(controller.createZapAction).toBeDefined();
    });

    it('should have getZapActions method', () => {
      expect(controller.getZapActions).toBeDefined();
    });

    it('should have getZapActionById method', () => {
      expect(controller.getZapActionById).toBeDefined();
    });

    it('should have updateZapAction method', () => {
      expect(controller.updateZapAction).toBeDefined();
    });

    it('should have deleteZapAction method', () => {
      expect(controller.deleteZapAction).toBeDefined();
    });
  });
});
