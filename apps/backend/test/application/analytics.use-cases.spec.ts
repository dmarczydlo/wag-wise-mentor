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
      expect(result.isSuccess()).to.be.true;
      const event = result.getValue();
      expect(event.userId).to.equal(userId);
      expect(event.eventType).to.equal(eventType);
      expect(event.eventName).to.equal(eventName);
      expect(event.properties).to.deep.equal(properties);
    });

    it("should save analytics event to repository", async () => {
      // Arrange
      const userId = "user-123";
      const eventType = "page_view";
      const eventName = "dashboard_viewed";

      // Act
      await useCases.trackEvent(userId, eventType, eventName);

      // Assert
      const result = await repository.findByUserId(userId);
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
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
      expect(result.isSuccess()).to.be.true;
      const event = result.getValue();
      expect(event.properties).to.deep.equal({});
    });
  });

  describe("getEvent", () => {
    it("should return analytics event when found", async () => {
      // Arrange
      const createResult = await useCases.trackEvent(
        "user-123",
        "user_action",
        "puppy_created",
        { puppyId: "puppy-456" }
      );
      expect(createResult.isSuccess()).to.be.true;
      const event = createResult.getValue();

      // Act
      const result = await useCases.getEvent(event.id);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const foundEvent = result.getValue();
      expect(foundEvent.id).to.equal(event.id);
      expect(foundEvent.userId).to.equal("user-123");
    });

    it("should return failure when event not found", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act
      const result = await useCases.getEvent(nonExistentId);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().code).to.equal("NOT_FOUND");
    });
  });

  describe("getUserEvents", () => {
    it("should return all analytics events for a user", async () => {
      // Arrange
      const userId = "user-123";
      const result1 = await useCases.trackEvent(
        userId,
        "user_action",
        "Event 1"
      );
      const result2 = await useCases.trackEvent(userId, "page_view", "Event 2");
      expect(result1.isSuccess()).to.be.true;
      expect(result2.isSuccess()).to.be.true;

      // Act
      const result = await useCases.getUserEvents(userId);

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
      const result = await useCases.getUserEvents(userId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.be.an("array").that.is.empty;
    });

    it("should only return events for specified user", async () => {
      // Arrange
      const user1 = "user-1";
      const user2 = "user-2";
      const result1 = await useCases.trackEvent(
        user1,
        "user_action",
        "User 1 event"
      );
      const result2 = await useCases.trackEvent(
        user2,
        "user_action",
        "User 2 event"
      );
      expect(result1.isSuccess()).to.be.true;
      expect(result2.isSuccess()).to.be.true;

      // Act
      const result = await useCases.getUserEvents(user1);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.have.length(1);
      expect(events[0].userId).to.equal(user1);
    });
  });

  describe("getEventsByType", () => {
    it("should return all events for an event type", async () => {
      // Arrange
      const eventType = "user_action";
      const result1 = await useCases.trackEvent("user-1", eventType, "Event 1");
      const result2 = await useCases.trackEvent("user-2", eventType, "Event 2");
      const result3 = await useCases.trackEvent(
        "user-3",
        "page_view",
        "Different type"
      );
      expect(result1.isSuccess()).to.be.true;
      expect(result2.isSuccess()).to.be.true;
      expect(result3.isSuccess()).to.be.true;

      // Act
      const result = await useCases.getEventsByType(eventType);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.have.length(2);
      expect(events[0].eventType).to.equal(eventType);
      expect(events[1].eventType).to.equal(eventType);
    });

    it("should return empty array when no events of type exist", async () => {
      // Arrange
      const eventType = "non-existent-type";

      // Act
      const result = await useCases.getEventsByType(eventType);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.be.an("array").that.is.empty;
    });
  });

  describe("getEventsByDateRange", () => {
    it("should return events within date range", async () => {
      // Arrange
      const now = new Date();
      const startDate = new Date(now.getTime() - 1000);
      const endDate = new Date(now.getTime() + 1000);
      const result1 = await useCases.trackEvent(
        "user-1",
        "user_action",
        "Event 1"
      );
      const result2 = await useCases.trackEvent(
        "user-2",
        "user_action",
        "Event 2"
      );
      expect(result1.isSuccess()).to.be.true;
      expect(result2.isSuccess()).to.be.true;

      // Act
      const result = await useCases.getEventsByDateRange(startDate, endDate);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events.length).to.be.greaterThan(0);
    });

    it("should return empty array when no events in date range", async () => {
      // Arrange
      const startDate = new Date("2020-01-01");
      const endDate = new Date("2020-12-31");

      // Act
      const result = await useCases.getEventsByDateRange(startDate, endDate);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.be.an("array").that.is.empty;
    });
  });

  describe("enrichEvent", () => {
    it("should enrich event properties successfully", async () => {
      // Arrange
      const createResult = await useCases.trackEvent(
        "user-123",
        "user_action",
        "puppy_created",
        { puppyId: "puppy-456" }
      );
      expect(createResult.isSuccess()).to.be.true;
      const event = createResult.getValue();
      const additionalProperties = { breed: "Golden Retriever", age: 3 };

      // Act
      const result = await useCases.enrichEvent(event.id, additionalProperties);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const enrichedEvent = result.getValue();
      expect(enrichedEvent.properties).to.deep.equal({
        puppyId: "puppy-456",
        breed: "Golden Retriever",
        age: 3,
      });
      expect(enrichedEvent.id).to.equal(event.id);
    });

    it("should return failure when enriching non-existent event", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      const additionalProperties = { key: "value" };

      // Act
      const result = await useCases.enrichEvent(
        nonExistentId,
        additionalProperties
      );

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().code).to.equal("NOT_FOUND");
    });
  });

  describe("deleteEvent", () => {
    it("should delete analytics event successfully", async () => {
      // Arrange
      const createResult = await useCases.trackEvent(
        "user-123",
        "user_action",
        "Event to delete"
      );
      expect(createResult.isSuccess()).to.be.true;
      const event = createResult.getValue();

      // Act
      const deleteResult = await useCases.deleteEvent(event.id);

      // Assert
      expect(deleteResult.isSuccess()).to.be.true;
      const getResult = await useCases.getEvent(event.id);
      expect(getResult.isFailure()).to.be.true;
      expect(getResult.getError().code).to.equal("NOT_FOUND");
    });

    it("should handle deletion of non-existent event gracefully", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act
      const result = await useCases.deleteEvent(nonExistentId);

      // Assert
      expect(result.isSuccess()).to.be.true;
    });
  });
});
