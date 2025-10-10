import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpExceptionFilter } from "../../src/common/filters/http-exception.filter";
import {
  ValidationErrorResponse,
  DomainErrorResponse,
  NotFoundErrorResponse,
  UnauthorizedErrorResponse,
  ForbiddenErrorResponse,
  InternalServerErrorResponse,
} from "../../src/common/dto/api-response.dto";

describe("HttpExceptionFilter - AAA Pattern", () => {
  let filter: HttpExceptionFilter;
  let mockRequest: any;
  let mockResponse: any;
  let mockJson: any;
  let mockStatus: any;

  beforeEach(() => {
    // Arrange
    filter = new HttpExceptionFilter();
    
    mockJson = {
      data: null,
      called: false,
    };
    
    mockStatus = {
      returnValue: null,
      called: false,
      calledWith: 0,
    };
    
    mockRequest = {
      url: "/test-path",
    };
    
    mockResponse = {
      status: (code: number) => {
        mockStatus.called = true;
        mockStatus.calledWith = code;
        return {
          json: (data: any) => {
            mockJson.data = data;
            mockJson.called = true;
            return data;
          },
        };
      },
    };
  });

  describe("Validation Errors", () => {
    it("should handle Zod validation errors correctly", () => {
      // Arrange
      const validationErrors = [
        {
          code: "too_small",
          minimum: 1,
          message: "Name is required",
          path: ["name"],
        },
      ];
      
      const exception = new BadRequestException({
        message: "Validation failed",
        errors: validationErrors,
      });
      
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockStatus.called).to.be.true;
      expect(mockStatus.calledWith).to.equal(400);
      expect(mockJson.called).to.be.true;
      expect(mockJson.data.success).to.be.false;
      expect(mockJson.data.error.code).to.equal("VALIDATION_ERROR");
      expect(mockJson.data.error.message).to.equal("Request validation failed");
      expect(mockJson.data.error.details).to.deep.equal(validationErrors);
      expect(mockJson.data.statusCode).to.equal(400);
      expect(mockJson.data.path).to.equal("/test-path");
    });

    it("should include timestamp in validation error response", () => {
      // Arrange
      const exception = new BadRequestException({
        message: "Validation failed",
        errors: [],
      });
      
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockJson.data.timestamp).to.be.a("string");
      const timestamp = new Date(mockJson.data.timestamp);
      expect(timestamp.getTime()).to.be.greaterThan(0);
    });
  });

  describe("Domain Errors", () => {
    it("should handle domain errors as BadRequestException", () => {
      // Arrange
      const exception = new BadRequestException("Puppy not found");
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockStatus.calledWith).to.equal(400);
      expect(mockJson.data.success).to.be.false;
      expect(mockJson.data.error.code).to.equal("DOMAIN_ERROR");
      expect(mockJson.data.error.message).to.equal("Puppy not found");
      expect(mockJson.data.statusCode).to.equal(400);
    });

    it("should handle array message format", () => {
      // Arrange
      const exception = new BadRequestException(["Error 1", "Error 2"]);
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockJson.data.error.code).to.equal("DOMAIN_ERROR");
    });
  });

  describe("Not Found Errors", () => {
    it("should handle NotFoundException", () => {
      // Arrange
      const exception = new NotFoundException("User not found");
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockStatus.calledWith).to.equal(404);
      expect(mockJson.data.success).to.be.false;
      expect(mockJson.data.error.code).to.equal("NOT_FOUND");
      expect(mockJson.data.error.message).to.equal("User not found not found");
      expect(mockJson.data.statusCode).to.equal(404);
    });
  });

  describe("Unauthorized Errors", () => {
    it("should handle UnauthorizedException", () => {
      // Arrange
      const exception = new UnauthorizedException(
        "Invalid authentication token"
      );
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockStatus.calledWith).to.equal(401);
      expect(mockJson.data.success).to.be.false;
      expect(mockJson.data.error.code).to.equal("UNAUTHORIZED");
      expect(mockJson.data.error.message).to.equal(
        "Invalid authentication token"
      );
      expect(mockJson.data.statusCode).to.equal(401);
    });

    it("should handle UnauthorizedException with default message", () => {
      // Arrange
      const exception = new UnauthorizedException();
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockJson.data.error.code).to.equal("UNAUTHORIZED");
      expect(mockJson.data.error.message).to.be.a("string");
    });
  });

  describe("Forbidden Errors", () => {
    it("should handle ForbiddenException", () => {
      // Arrange
      const exception = new ForbiddenException("Access denied");
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockStatus.calledWith).to.equal(403);
      expect(mockJson.data.success).to.be.false;
      expect(mockJson.data.error.code).to.equal("FORBIDDEN");
      expect(mockJson.data.error.message).to.equal("Access denied");
      expect(mockJson.data.statusCode).to.equal(403);
    });
  });

  describe("Generic HTTP Exceptions", () => {
    it("should handle generic HttpException", () => {
      // Arrange
      const exception = new HttpException("Custom error", HttpStatus.CONFLICT);
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockStatus.calledWith).to.equal(409);
      expect(mockJson.data.success).to.be.false;
      expect(mockJson.data.error.code).to.equal("HTTP_409");
      expect(mockJson.data.error.message).to.equal("Custom error");
      expect(mockJson.data.statusCode).to.equal(409);
    });
  });

  describe("Internal Server Errors", () => {
    it("should handle unknown errors as InternalServerError", () => {
      // Arrange
      const exception = new Error("Unexpected error");
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockStatus.calledWith).to.equal(500);
      expect(mockJson.data.success).to.be.false;
      expect(mockJson.data.error.code).to.equal("INTERNAL_SERVER_ERROR");
      expect(mockJson.data.statusCode).to.equal(500);
    });

    it("should hide error details in production", () => {
      // Arrange
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      
      const exception = new Error("Sensitive error message");
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockJson.data.error.message).to.equal(
        "An unexpected error occurred"
      );
      
      // Cleanup
      process.env.NODE_ENV = originalEnv;
    });

    it("should show error details in development", () => {
      // Arrange
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";
      
      const exception = new Error("Debug error message");
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockJson.data.error.message).to.equal("Debug error message");
      
      // Cleanup
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("Response Structure", () => {
    it("should always include required fields", () => {
      // Arrange
      const exception = new BadRequestException("Test error");
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockJson.data).to.have.property("success");
      expect(mockJson.data).to.have.property("error");
      expect(mockJson.data).to.have.property("statusCode");
      expect(mockJson.data).to.have.property("timestamp");
      expect(mockJson.data).to.have.property("path");
    });

    it("should include correct path from request", () => {
      // Arrange
      mockRequest.url = "/custom/test/path";
      const exception = new BadRequestException("Test");
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;

      // Act
      filter.catch(exception, host);

      // Assert
      expect(mockJson.data.path).to.equal("/custom/test/path");
    });
  });
});

