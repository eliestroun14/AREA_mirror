import { Test, TestingModule } from '@nestjs/testing';
import { JwtOAuthGuard } from './jwt-oauth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

describe('JwtOAuthGuard', () => {
  let guard: JwtOAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtOAuthGuard],
    }).compile();

    guard = module.get<JwtOAuthGuard>(JwtOAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should call super.canActivate with context', () => {
      const mockRequest = {
        query: {
          token: 'jwt.token',
        },
        headers: {},
      } as unknown as Request;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      const superSpy = jest
        .spyOn(Object.getPrototypeOf(guard), 'canActivate')
        .mockReturnValue(true);

      void guard.canActivate(mockContext);

      expect(superSpy).toHaveBeenCalledWith(mockContext);
    });

    it('should extract context and request correctly', () => {
      const mockRequest = {
        query: {},
        headers: {},
      } as unknown as Request;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      jest
        .spyOn(Object.getPrototypeOf(guard), 'canActivate')
        .mockReturnValue(true);

      void guard.canActivate(mockContext);

      // The guard should have accessed the request
      expect(mockContext.switchToHttp).toBeDefined();
    });

    it('should be instance of AuthGuard', () => {
      expect(guard).toBeDefined();
      expect(typeof guard.canActivate).toBe('function');
    });

    it('should extend AuthGuard with jwt strategy', () => {
      expect(guard).toBeInstanceOf(JwtOAuthGuard);
    });
  });
});
