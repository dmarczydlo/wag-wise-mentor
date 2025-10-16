import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, type TestingModule } from "@nestjs/testing";
import { AnalyticsController } from "../../src/infrastructure/analytics/analytics.controller";
import { AnalyticsUseCases } from "../../src/application/analytics/analytics.use-cases";
import { InMemoryAnalyticsRepository } from "../../src/infrastructure/analytics/in-memory-analytics.repository";
import { NotFoundException as _NotFoundException } from "@nestjs/common";

describe("AnalyticsController Integration Tests - AAA Pattern", () => {
  let controller: AnalyticsController;
  let useCases: AnalyticsUseCases;

  beforeEach(async () => {
    // Arrange
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        AnalyticsUseCases,
        {
          provide: "AnalyticsRepository",
          useClass: InMemoryAnalyticsRepository,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    useCases = module.get<AnalyticsUseCases>(AnalyticsUseCases);
  });

  describe("POST /analytics/events", () => {
    it("should track a new analytics event successfully", async () => {
      // Arrange
      const body = {
        userId: "user-123",
        eventType: "user_action",
        eventName: "puppy_created",
        properties: { puppyId: "puppy-456", breed: "Golden Retriever" },
      };

      // Act
      const result = await controller.trackEvent(body);

      // Assert
      expect(result).to.not.be.null;
      expect(result.getValue().userId).to.equal(body.userId);
      expect(result.getValue().eventType).to.equal(body.eventType);
      expect(result.getValue().eventName).to.equal(body.eventName);
      expect(result.getValue().properties).to.deep.equal(body.properties);
    });

    it("should return valid event with ID and timestamp", async () => {
      // Arrange
      const body = {
        userId: "user-123",
        eventType: "page_view",
        eventName: "dashboard_viewed",
      };

      // Act
      const result = await controller.trackEvent(body);

      // Assert
      expect(result.getValue().id).to.not.be.undefined;
      expect(result.getValue().timestamp).to.be.instanceOf(Date);
    });
  });

  describe("GET /analytics/events/:id", () => {
    it("should return analytics event by id", async () => {
      // Arrange
      const event = await useCases.trackEvent(
        "user-123",
        "user_action",
        "puppy_created",
        { puppyId: "puppy-456" }
      );

      // Act
      const result = await controller.getEvent(event.getValue().id);

      // Assert
      expect(result).to.not.be.null;
      expect(result.getValue().id).to.equal(event.getValue().id);
      expect(result.getValue().userId).to.equal("user-123");
    });

    it("should throw NotFoundException when event not found", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act & Assert
      const result = await controller.getEvent(nonExistentId);
      expect(result.isFailure()).to.be.true;
      expect(result.getError().code).to.equal("NOT_FOUND");
    });
  });

  describe("GET /analytics/events/user/:userId", () => {
    it("should return all analytics events for a user", async () => {
      // Arrange
      const userId = "user-123";
      await useCases.trackEvent(userId, "user_action", "Event 1");
      await useCases.trackEvent(userId, "page_view", "Event 2");

      // Act
      const result = await controller.getUserEvents(userId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.have.length(2);
      expect(events[0].userId).to.equal(userId);
      expect(events[1].userId).to.equal(userId);
    });

    it("should return empty array when user has no events", async () => {
      // Arrange
      const userId = "user-with-no-events";

      // Act
      const result = await controller.getUserEvents(userId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.be.an("array").that.is.empty;
    });
  });

  describe("GET /analytics/events?eventType=", () => {
    it("should return events by type", async () => {
      // Arrange
      const eventType = "user_action";
      await useCases.trackEvent("user-1", eventType, "Event 1");
      await useCases.trackEvent("user-2", eventType, "Event 2");

      // Act
      const result = await controller.getEventsByType(eventType);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.have.length(2);
      expect(events[0].eventType).to.equal(eventType);
      expect(events[1].eventType).to.equal(eventType);
    });

    it("should return empty array when event type not provided", async () => {
      // Arrange & Act
      const result = await controller.getEventsByType("");

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.be.an("array").that.is.empty;
    });
  });

  describe("GET /analytics/events/date-range", () => {
    it("should return events within date range", async () => {
      // Arrange
      await useCases.trackEvent("user-1", "user_action", "Event 1");
      await useCases.trackEvent("user-2", "user_action", "Event 2");
      const now = new Date();
      const startDate = new Date(now.getTime() - 1000).toISOString();
      const endDate = new Date(now.getTime() + 1000).toISOString();

      // Act
      const result = await controller.getEventsByDateRange(startDate, endDate);

      // Assert
      expect(result.getValue().length).to.be.greaterThan(0);
    });

    it("should return empty array when no events in date range", async () => {
      // Arrange
      const startDate = "2020-01-01";
      const endDate = "2020-12-31";

      // Act
      const result = await controller.getEventsByDateRange(startDate, endDate);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.be.an("array").that.is.empty;
    });
  });

  describe("PUT /analytics/events/:id/enrich", () => {
    it("should enrich event properties successfully", async () => {
      // Arrange
      const event = await useCases.trackEvent(
        "user-123",
        "user_action",
        "puppy_created",
        { puppyId: "puppy-456" }
      );
      const body = { properties: { breed: "Golden Retriever", age: 3 } };

      // Act
      const result = await controller.enrichEvent(event.getValue().id, body);

      // Assert
      expect(result.getValue().properties).to.deep.equal({
        puppyId: "puppy-456",
        breed: "Golden Retriever",
        age: 3,
      });
      expect(result.getValue().id).to.equal(event.getValue().id);
    });

    it("should throw NotFoundException when enriching non-existent event", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      const body = { properties: { key: "value" } };

      // Act & Assert
      const result = await controller.enrichEvent(nonExistentId, body);
      expect(result.isFailure()).to.be.true;
      expect(result.getError().code).to.equal("NOT_FOUND");
    });
  });

  describe("DELETE /analytics/events/:id", () => {
    it("should delete analytics event successfully", async () => {
      // Arrange
      const event = await useCases.trackEvent(
        "user-123",
        "user_action",
        "Event to delete"
      );

      // Act
      const result = await controller.deleteEvent(event.getValue().id);

      // Assert
      expect(result.message).to.equal("Analytics event deleted successfully");
    });

    it("should handle deletion of non-existent event gracefully", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act
      const result = await controller.deleteEvent(nonExistentId);

      // Assert
      expect(result.message).to.equal("Analytics event deleted successfully");
    });
  });
});
