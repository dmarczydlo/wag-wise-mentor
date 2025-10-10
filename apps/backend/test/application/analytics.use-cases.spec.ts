import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, TestingModule } from "@nestjs/testing";
import { AnalyticsUseCases } from "../../src/application/analytics/analytics.use-cases";
import { InMemoryAnalyticsRepository } from "../../src/infrastructure/analytics/in-memory-analytics.repository";
import { NotFoundException } from "@nestjs/common";

describe("Analytics Use Cases - AAA Pattern", () => {
  let useCases: AnalyticsUseCases;
  let repository: InMemoryAnalyticsRepository;

  beforeEach(async () => {
    // Arrange
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsUseCases,
        {
          provide: "AnalyticsRepository",
          useClass: InMemoryAnalyticsRepository,
        },
      ],
    }).compile();

    useCases = module.get<AnalyticsUseCases>(AnalyticsUseCases);
    repository = module.get<InMemoryAnalyticsRepository>("AnalyticsRepository");
  });

  describe("trackEvent", () => {
    it("should track a new analytics event successfully", async () => {
      // Arrange
      const userId = "user-123";
      const eventType = "user_action";
      const eventName = "puppy_created";
      const properties = { puppyId: "puppy-456", breed: "Golden Retriever" };

      // Act
      const result = await useCases.trackEvent(
        userId,
        eventType,
        eventName,
        properties
      );

      // Assert
      expect(result).to.not.be.null;
      expect(result.userId).to.equal(userId);
      expect(result.eventType).to.equal(eventType);
      expect(result.eventName).to.equal(eventName);
      expect(result.properties).to.deep.equal(properties);
    });

    it("should save analytics event to repository", async () => {
      // Arrange
      const userId = "user-123";
      const eventType = "page_view";
      const eventName = "dashboard_viewed";

      // Act
      await useCases.trackEvent(userId, eventType, eventName);

      // Assert
      const events = await repository.findByUserId(userId);
      expect(events).to.have.length(1);
      expect(events[0].userId).to.equal(userId);
    });

    it("should handle empty properties", async () => {
      // Arrange
      const userId = "user-123";
      const eventType = "user_action";
      const eventName = "button_clicked";

      // Act
      const result = await useCases.trackEvent(userId, eventType, eventName);

      // Assert
      expect(result.properties).to.deep.equal({});
    });
  });

  describe("getEvent", () => {
    it("should return analytics event when found", async () => {
      // Arrange
      const event = await useCases.trackEvent(
        "user-123",
        "user_action",
        "puppy_created",
        { puppyId: "puppy-456" }
      );

      // Act
      const result = await useCases.getEvent(event.id);

      // Assert
      expect(result).to.not.be.null;
      expect(result.id).to.equal(event.id);
      expect(result.userId).to.equal("user-123");
    });

    it("should throw NotFoundException when event not found", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act & Assert
      try {
        await useCases.getEvent(nonExistentId);
        expect.fail("Should have thrown NotFoundException");
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundException);
        expect(error.message).to.include(nonExistentId);
      }
    });
  });

  describe("getUserEvents", () => {
    it("should return all analytics events for a user", async () => {
      // Arrange
      const userId = "user-123";
      await useCases.trackEvent(userId, "user_action", "Event 1");
      await useCases.trackEvent(userId, "page_view", "Event 2");

      // Act
      const result = await useCases.getUserEvents(userId);

      // Assert
      expect(result).to.have.length(2);
      expect(result[0].userId).to.equal(userId);
      expect(result[1].userId).to.equal(userId);
    });

    it("should return empty array when user has no events", async () => {
      // Arrange
      const userId = "user-with-no-events";

      // Act
      const result = await useCases.getUserEvents(userId);

      // Assert
      expect(result).to.be.an("array").that.is.empty;
    });

    it("should only return events for specified user", async () => {
      // Arrange
      const user1 = "user-1";
      const user2 = "user-2";
      await useCases.trackEvent(user1, "user_action", "User 1 event");
      await useCases.trackEvent(user2, "user_action", "User 2 event");

      // Act
      const result = await useCases.getUserEvents(user1);

      // Assert
      expect(result).to.have.length(1);
      expect(result[0].userId).to.equal(user1);
    });
  });

  describe("getEventsByType", () => {
    it("should return all events for an event type", async () => {
      // Arrange
      const eventType = "user_action";
      await useCases.trackEvent("user-1", eventType, "Event 1");
      await useCases.trackEvent("user-2", eventType, "Event 2");
      await useCases.trackEvent("user-3", "page_view", "Different type");

      // Act
      const result = await useCases.getEventsByType(eventType);

      // Assert
      expect(result).to.have.length(2);
      expect(result[0].eventType).to.equal(eventType);
      expect(result[1].eventType).to.equal(eventType);
    });

    it("should return empty array when no events of type exist", async () => {
      // Arrange
      const eventType = "non-existent-type";

      // Act
      const result = await useCases.getEventsByType(eventType);

      // Assert
      expect(result).to.be.an("array").that.is.empty;
    });
  });

  describe("getEventsByDateRange", () => {
    it("should return events within date range", async () => {
      // Arrange
      const now = new Date();
      const startDate = new Date(now.getTime() - 1000);
      const endDate = new Date(now.getTime() + 1000);
      await useCases.trackEvent("user-1", "user_action", "Event 1");
      await useCases.trackEvent("user-2", "user_action", "Event 2");

      // Act
      const result = await useCases.getEventsByDateRange(startDate, endDate);

      // Assert
      expect(result.length).to.be.greaterThan(0);
    });

    it("should return empty array when no events in date range", async () => {
      // Arrange
      const startDate = new Date("2020-01-01");
      const endDate = new Date("2020-12-31");

      // Act
      const result = await useCases.getEventsByDateRange(startDate, endDate);

      // Assert
      expect(result).to.be.an("array").that.is.empty;
    });
  });

  describe("enrichEvent", () => {
    it("should enrich event properties successfully", async () => {
      // Arrange
      const event = await useCases.trackEvent(
        "user-123",
        "user_action",
        "puppy_created",
        { puppyId: "puppy-456" }
      );
      const additionalProperties = { breed: "Golden Retriever", age: 3 };

      // Act
      const result = await useCases.enrichEvent(event.id, additionalProperties);

      // Assert
      expect(result.properties).to.deep.equal({
        puppyId: "puppy-456",
        breed: "Golden Retriever",
        age: 3,
      });
      expect(result.id).to.equal(event.id);
    });

    it("should throw NotFoundException when enriching non-existent event", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      const additionalProperties = { key: "value" };

      // Act & Assert
      try {
        await useCases.enrichEvent(nonExistentId, additionalProperties);
        expect.fail("Should have thrown NotFoundException");
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundException);
      }
    });
  });

  describe("deleteEvent", () => {
    it("should delete analytics event successfully", async () => {
      // Arrange
      const event = await useCases.trackEvent(
        "user-123",
        "user_action",
        "Event to delete"
      );

      // Act
      await useCases.deleteEvent(event.id);

      // Assert
      try {
        await useCases.getEvent(event.id);
        expect.fail("Should have thrown NotFoundException");
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundException);
      }
    });

    it("should handle deletion of non-existent event gracefully", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act & Assert
      await useCases.deleteEvent(nonExistentId);
    });
  });
});
