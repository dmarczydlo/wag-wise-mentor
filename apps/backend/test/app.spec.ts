import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { expect, sinon } from './setup';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    // Clear all stubs before each test
    sinon.restore();
    
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return welcome message', () => {
      const result = appController.getHello();
      expect(result).to.equal('Wag Wise Mentor API is running! 🐕');
    });
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const result = appController.getHealth();
      expect(result).to.have.property('status', 'ok');
      expect(result).to.have.property('timestamp');
      expect(result).to.have.property('uptime');
      expect(result.uptime).to.be.a('number');
    });
  });
});

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    // Clear all stubs before each test
    sinon.restore();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return welcome message', () => {
      const result = service.getHello();
      expect(result).to.equal('Wag Wise Mentor API is running! 🐕');
    });
  });
});
