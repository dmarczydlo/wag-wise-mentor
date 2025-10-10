import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { of } from "rxjs";
import { TransformResponseInterceptor } from "../../src/common/interceptors/transform-response.interceptor";

describe("TransformResponseInterceptor - AAA Pattern", () => {
  let interceptor: TransformResponseInterceptor<any>;
  let mockExecutionContext: any;
  let mockCallHandler: any;

  beforeEach(() => {
    // Arrange
    interceptor = new TransformResponseInterceptor();
    
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          url: "/test-path",
        }),
      }),
    };
  });

  describe("Simple Data Transformation", () => {
    it("should wrap simple string data in success response", (done) => {
      // Arrange
      const testData = "Hello World";
      mockCallHandler = {
        handle: () => of(testData),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result).to.have.property("success", true);
          expect(result).to.have.property("data", testData);
          expect(result).to.have.property("timestamp");
          expect(result).to.have.property("path", "/test-path");
          expect(result.timestamp).to.be.a("string");
          done();
        });
    });

    it("should wrap number data in success response", (done) => {
      // Arrange
      const testData = 42;
      mockCallHandler = {
        handle: () => of(testData),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.success).to.be.true;
          expect(result.data).to.equal(testData);
          done();
        });
    });

    it("should wrap boolean data in success response", (done) => {
      // Arrange
      const testData = true;
      mockCallHandler = {
        handle: () => of(testData),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.success).to.be.true;
          expect(result.data).to.equal(testData);
          done();
        });
    });

    it("should wrap null data in success response", (done) => {
      // Arrange
      const testData = null;
      mockCallHandler = {
        handle: () => of(testData),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.success).to.be.true;
          expect(result.data).to.be.null;
          done();
        });
    });
  });

  describe("Object Data Transformation", () => {
    it("should wrap object data in success response", (done) => {
      // Arrange
      const testData = {
        id: "123",
        name: "Test User",
      };
      mockCallHandler = {
        handle: () => of(testData),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.success).to.be.true;
          expect(result.data).to.deep.equal(testData);
          expect(result.path).to.equal("/test-path");
          done();
        });
    });

    it("should wrap array data in success response", (done) => {
      // Arrange
      const testData = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];
      mockCallHandler = {
        handle: () => of(testData),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.success).to.be.true;
          expect(result.data).to.deep.equal(testData);
          expect(result.data).to.be.an("array");
          expect(result.data).to.have.lengthOf(2);
          done();
        });
    });

    it("should wrap empty array in success response", (done) => {
      // Arrange
      const testData: any[] = [];
      mockCallHandler = {
        handle: () => of(testData),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.success).to.be.true;
          expect(result.data).to.deep.equal([]);
          expect(result.data).to.be.an("array");
          done();
        });
    });
  });

  describe("Objects with success Property", () => {
    it("should handle response that already has success:true", (done) => {
      // Arrange
      const testData = {
        success: true,
        user: { id: "123", name: "Test" },
      };
      mockCallHandler = {
        handle: () => of(testData),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.success).to.be.true;
          expect(result.data).to.have.property("success", true);
          expect(result.data).to.have.property("user");
          done();
        });
    });

    it("should handle response with success:false", (done) => {
      // Arrange
      const testData = {
        success: false,
        error: "Something went wrong",
      };
      mockCallHandler = {
        handle: () => of(testData),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.success).to.be.true;
          expect(result.data).to.deep.equal(testData);
          done();
        });
    });
  });

  describe("Path Handling", () => {
    it("should include correct path from request", (done) => {
      // Arrange
      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            url: "/users/123",
          }),
        }),
      };
      
      mockCallHandler = {
        handle: () => of({ id: "123" }),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.path).to.equal("/users/123");
          done();
        });
    });

    it("should handle paths with query parameters", (done) => {
      // Arrange
      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            url: "/users?page=1&limit=10",
          }),
        }),
      };
      
      mockCallHandler = {
        handle: () => of([]),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.path).to.equal("/users?page=1&limit=10");
          done();
        });
    });
  });

  describe("Timestamp Generation", () => {
    it("should generate ISO 8601 timestamp", (done) => {
      // Arrange
      mockCallHandler = {
        handle: () => of({ test: "data" }),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.timestamp).to.be.a("string");
          
          // Check if valid ISO 8601 format
          const timestampDate = new Date(result.timestamp);
          expect(timestampDate.getTime()).to.be.greaterThan(0);
          expect(result.timestamp).to.match(/^\d{4}-\d{2}-\d{2}T/);
          done();
        });
    });

    it("should generate current timestamp", (done) => {
      // Arrange
      const beforeTime = new Date();
      mockCallHandler = {
        handle: () => of({ test: "data" }),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          const afterTime = new Date();
          const resultTime = new Date(result.timestamp);
          
          expect(resultTime.getTime()).to.be.at.least(beforeTime.getTime());
          expect(resultTime.getTime()).to.be.at.most(afterTime.getTime());
          done();
        });
    });
  });

  describe("Complex Nested Data", () => {
    it("should handle deeply nested objects", (done) => {
      // Arrange
      const testData = {
        user: {
          id: "123",
          profile: {
            name: "John",
            address: {
              street: "123 Main St",
              city: "Boston",
            },
          },
        },
        metadata: {
          created: new Date(),
        },
      };
      
      mockCallHandler = {
        handle: () => of(testData),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.success).to.be.true;
          expect(result.data).to.deep.equal(testData);
          expect(result.data.user.profile.address.city).to.equal("Boston");
          done();
        });
    });

    it("should handle mixed array and object data", (done) => {
      // Arrange
      const testData = {
        users: [
          { id: "1", name: "User 1" },
          { id: "2", name: "User 2" },
        ],
        pagination: {
          page: 1,
          total: 2,
        },
      };
      
      mockCallHandler = {
        handle: () => of(testData),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result.success).to.be.true;
          expect(result.data.users).to.be.an("array");
          expect(result.data.users).to.have.lengthOf(2);
          expect(result.data.pagination.page).to.equal(1);
          done();
        });
    });
  });

  describe("Response Structure", () => {
    it("should always have required fields", (done) => {
      // Arrange
      mockCallHandler = {
        handle: () => of({ test: "data" }),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result).to.have.property("success");
          expect(result).to.have.property("data");
          expect(result).to.have.property("timestamp");
          expect(result).to.have.property("path");
          expect(result.success).to.be.true;
          done();
        });
    });

    it("should not have message field by default", (done) => {
      // Arrange
      mockCallHandler = {
        handle: () => of({ test: "data" }),
      };

      // Act
      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          // Assert
          expect(result).to.not.have.property("message");
          done();
        });
    });
  });
});

