import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { InMemoryAnalyticsRepository } from "../../src/infrastructure/analytics/in-memory-analytics.repository";
import { AnalyticsEvent } from "../../src/domain/analytics/analytics-event.entity";

describe("InMemoryAnalyticsRepository - AAA Pattern", () => {
  let repository: InMemoryAnalyticsRepository;

  beforeEach(() => {
    // Arrange
    repository = new InMemoryAnalyticsRepository();
  });

  describe("save", () => {
    it("should save analytics event successfully", async () => {
      // Arrange
      const event = AnalyticsEvent.create(
        "event-1",
        "user-1",
        "user_action",
        "puppy_created",
        { puppyId: "puppy-456" },
        new Date()
      );

      // Act
      const savedEvent = await repository.save(event);

      // Assert
      expect(savedEvent).to.deep.equal(event);
    });

    it("should update existing event when saving with same ID", async () => {
      // Arrange
      const eventId = "event-1";
      const originalEvent = AnalyticsEvent.create(
        eventId,
        "user-1",
        "user_action",
        "puppy_created",
        { puppyId: "puppy-456" },
        new Date()
      );
      await repository.save(originalEvent);

      const updatedEvent = originalEvent.enrichProperties({
        breed: "Golden Retriever",
      });

      // Act
      const savedEvent = await repository.save(updatedEvent);

      // Assert
      expect(savedEvent.properties).to.deep.equal({
        puppyId: "puppy-456",
        breed: "Golden Retriever",
      });
      const foundEvent = await repository.findById(eventId);
      expect(foundEvent!.properties).to.deep.equal({
        puppyId: "puppy-456",
        breed: "Golden Retriever",
      });
    });
  });

  describe("findById", () => {
    it("should return analytics event when found", async () => {
      // Arrange
      const event = AnalyticsEvent.create(
        "event-1",
        "user-1",
        "user_action",
        "puppy_created",
        { puppyId: "puppy-456" },
        new Date()
      );
      await repository.save(event);

      // Act
      const foundEvent = await repository.findById("event-1");

      // Assert
      expect(foundEvent).to.not.be.null;
      expect(foundEvent!.id).to.equal("event-1");
    });

    it("should return null when event not found", async () => {
      // Arrange
      const nonExistentId = "non-existent";

      // Act
      const foundEvent = await repository.findById(nonExistentId);

      // Assert
      expect(foundEvent).to.be.null;
    });
  });

  describe("findByUserId", () => {
    it("should return all analytics events for a user", async () => {
      // Arrange
      const userId = "user-1";
      const event1 = AnalyticsEvent.create(
        "event-1",
        userId,
        "user_action",
        "Event 1",
        {},
        new Date()
      );
      const event2 = AnalyticsEvent.create(
        "event-2",
        userId,
        "page_view",
        "Event 2",
        {},
        new Date()
      );
      await repository.save(event1);
      await repository.save(event2);

      // Act
      const events = await repository.findByUserId(userId);

      // Assert
      expect(events).to.have.length(2);
      expect(events).to.deep.include(event1);
      expect(events).to.deep.include(event2);
    });

    it("should return empty array when user has no events", async () => {
      // Arrange
      const userId = "user-with-no-events";

      // Act
      const events = await repository.findByUserId(userId);

      // Assert
      expect(events).to.be.an("array").that.is.empty;
    });

    it("should only return events for specified user", async () => {
      // Arrange
      const user1 = "user-1";
      const user2 = "user-2";
      const event1 = AnalyticsEvent.create(
        "event-1",
        user1,
        "user_action",
        "Event 1",
        {},
        new Date()
      );
      const event2 = AnalyticsEvent.create(
        "event-2",
        user2,
        "page_view",
        "Event 2",
        {},
        new Date()
      );
      await repository.save(event1);
      await repository.save(event2);

      // Act
      const events = await repository.findByUserId(user1);

      // Assert
      expect(events).to.have.length(1);
      expect(events[0]).to.deep.equal(event1);
    });
  });

  describe("findByEventType", () => {
    it("should return all events for an event type", async () => {
      // Arrange
      const eventType = "user_action";
      const event1 = AnalyticsEvent.create(
        "event-1",
        "user-1",
        eventType,
        "Event 1",
        {},
        new Date()
      );
      const event2 = AnalyticsEvent.create(
        "event-2",
        "user-2",
        eventType,
        "Event 2",
        {},
        new Date()
      );
      const event3 = AnalyticsEvent.create(
        "event-3",
        "user-3",
        "page_view",
        "Different type",
        {},
        new Date()
      );
      await repository.save(event1);
      await repository.save(event2);
      await repository.save(event3);

      // Act
      const events = await repository.findByEventType(eventType);

      // Assert
      expect(events).to.have.length(2);
      expect(events).to.deep.include(event1);
      expect(events).to.deep.include(event2);
    });

    it("should return empty array when no events of type exist", async () => {
      // Arrange
      const eventType = "non-existent-type";

      // Act
      const events = await repository.findByEventType(eventType);

      // Assert
      expect(events).to.be.an("array").that.is.empty;
    });
  });

  describe("findByDateRange", () => {
    it("should return events within date range", async () => {
      // Arrange
      const startDate = new Date("2024-01-01");
      const midDate = new Date("2024-06-15");
      const endDate = new Date("2024-12-31");

      const event1 = AnalyticsEvent.create(
        "event-1",
        "user-1",
        "user_action",
        "Event 1",
        {},
        midDate
      );
      const event2 = AnalyticsEvent.create(
        "event-2",
        "user-2",
        "user_action",
        "Event 2",
        {},
        new Date("2023-01-01")
      );
      await repository.save(event1);
      await repository.save(event2);

      // Act
      const events = await repository.findByDateRange(startDate, endDate);

      // Assert
      expect(events).to.have.length(1);
      expect(events[0]).to.deep.equal(event1);
    });

    it("should return empty array when no events in date range", async () => {
      // Arrange
      const startDate = new Date("2020-01-01");
      const endDate = new Date("2020-12-31");

      // Act
      const events = await repository.findByDateRange(startDate, endDate);

      // Assert
      expect(events).to.be.an("array").that.is.empty;
    });
  });

  describe("delete", () => {
    it("should delete existing analytics event", async () => {
      // Arrange
      const event = AnalyticsEvent.create(
        "event-1",
        "user-1",
        "user_action",
        "Event to delete",
        {},
        new Date()
      );
      await repository.save(event);

      // Act
      await repository.delete("event-1");

      // Assert
      const foundEvent = await repository.findById("event-1");
      expect(foundEvent).to.be.null;
    });

    it("should handle deletion of non-existent event gracefully", async () => {
      // Arrange
      const nonExistentId = "non-existent";

      // Act & Assert
      await repository.delete(nonExistentId);
    });
  });
});
