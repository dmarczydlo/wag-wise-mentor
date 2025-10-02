import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

export class TestDatabase {
  private static instance: TestDatabase;
  private testModule: TestingModule;

  private constructor() {}

  static getInstance(): TestDatabase {
    if (!TestDatabase.instance) {
      TestDatabase.instance = new TestDatabase();
    }
    return TestDatabase.instance;
  }

  async setupTestModule(moduleClass: any): Promise<TestingModule> {
    this.testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        moduleClass,
      ],
    }).compile();

    return this.testModule;
  }

  async cleanup(): Promise<void> {
    if (this.testModule) {
      await this.testModule.close();
    }
  }

  getModule(): TestingModule {
    return this.testModule;
  }
}

export const testDb = TestDatabase.getInstance();
