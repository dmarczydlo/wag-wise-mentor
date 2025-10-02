import 'reflect-metadata';
import { expect } from 'chai';
import * as sinon from 'sinon';

// Global test utilities
export const testUtils = {
  createMock: sinon.stub,
  createSpy: sinon.spy,
  createStub: sinon.stub,
  restore: sinon.restore,
};

// Custom assertions
export const customAssertions = {
  async shouldThrowAsync(fn: () => Promise<any>, expectedError?: any) {
    try {
      await fn();
      expect.fail('Expected function to throw an error');
    } catch (error) {
      if (expectedError) {
        expect(error).to.be.instanceOf(expectedError);
      }
    }
  },
};

// Export for use in tests
export { expect, sinon };
