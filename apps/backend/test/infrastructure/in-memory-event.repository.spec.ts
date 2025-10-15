import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { InMemoryEventRepository } from "../../src/infrastructure/calendar/in-memory-event.repository";
import {
  Event,
  EventId,
  EventType,
  EventDateTime,
  EventTitle,
  EventDescription,
  EventTypeEnum,
} from "../../src/domain/calendar/event.entity";

describe("InMemoryEventRepository - AAA Pattern", () => {
  let repository: InMemoryEventRepository;

  beforeEach(() => {
    // Arrange - Setup test dependencies
    repository = new InMemoryEventRepository();
    repository.clear(); // Clean state for each test
  });

  describe("save", () => {
    it("should save event successfully", async () => {
      // Arrange
      const eventResult = Event.create(
        new EventId("event-1"),
        new EventTitle("Morning Feeding"),
        new EventDescription("Regular morning feeding"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-1"
      );
      expect(eventResult.isSuccess()).to.be.true;
      const event = eventResult.getValue();

      // Act
      const result = await repository.save(event);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(event);
      expect(repository.getCount()).to.equal(1);
    });

    it("should update existing event when saving with same ID", async () => {
      // Arrange
      const eventResult = Event.create(
        new EventId("event-1"),
        new EventTitle("Morning Feeding"),
        new EventDescription("Regular morning feeding"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-1"
      );
      expect(eventResult.isSuccess()).to.be.true;
      const event = eventResult.getValue();
      await repository.save(event);

      const updatedEventResult = Event.create(
        new EventId("event-1"),
        new EventTitle("Updated Morning Feeding"),
        new EventDescription("Updated description"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-1"
      );
      expect(updatedEventResult.isSuccess()).to.be.true;
      const updatedEvent = updatedEventResult.getValue();

      // Act
      const result = await repository.save(updatedEvent);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(updatedEvent);
      expect(repository.getCount()).to.equal(1);
      expect(result.getValue().title.value).to.equal("Updated Morning Feeding");
    });
  });

  describe("findById", () => {
    it("should return event when found", async () => {
      // Arrange
      const eventResult = Event.create(
        new EventId("event-1"),
        new EventTitle("Morning Feeding"),
        new EventDescription("Regular morning feeding"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-1"
      );
      expect(eventResult.isSuccess()).to.be.true;
      const event = eventResult.getValue();
      await repository.save(event);

      // Act
      const result = await repository.findById(new EventId("event-1"));

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(event);
    });

    it("should return null when event not found", async () => {
      // Arrange
      const nonExistentId = new EventId("non-existent");

      // Act
      const result = await repository.findById(nonExistentId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.be.null;
    });
  });

  describe("findByPuppyId", () => {
    it("should return events for specific puppy", async () => {
      // Arrange
      const event1Result = Event.create(
        new EventId("event-1"),
        new EventTitle("Morning Feeding"),
        new EventDescription("Regular morning feeding"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-1"
      );
      const event2Result = Event.create(
        new EventId("event-2"),
        new EventTitle("Vet Checkup"),
        new EventDescription("Regular health checkup"),
        new EventDateTime(new Date("2024-01-16T10:00:00Z")),
        new EventType(EventTypeEnum.VET_APPOINTMENT),
        "puppy-1"
      );
      const event3Result = Event.create(
        new EventId("event-3"),
        new EventTitle("Morning Feeding"),
        new EventDescription("Regular morning feeding"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-2"
      );
      expect(event1Result.isSuccess()).to.be.true;
      expect(event2Result.isSuccess()).to.be.true;
      expect(event3Result.isSuccess()).to.be.true;
      const event1 = event1Result.getValue();
      const event2 = event2Result.getValue();
      const event3 = event3Result.getValue();
      await repository.save(event1);
      await repository.save(event2);
      await repository.save(event3);

      // Act
      const result = await repository.findByPuppyId("puppy-1");

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.have.length(2);
      expect(events).to.deep.include(event1);
      expect(events).to.deep.include(event2);
      expect(events).to.not.deep.include(event3);
    });

    it("should return empty array when no events found for puppy", async () => {
      // Arrange
      const puppyId = "puppy-with-no-events";

      // Act
      const result = await repository.findByPuppyId(puppyId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.be.an("array").that.is.empty;
    });
  });

  describe("findByDateRange", () => {
    beforeEach(async () => {
      // Arrange - Create events with different dates
      const events = [
        Event.create(
          new EventId("event-1"),
          new EventTitle("Morning Feeding"),
          new EventDescription("Regular morning feeding"),
          new EventDateTime(new Date("2024-01-15T08:00:00Z")),
          new EventType(EventTypeEnum.FEEDING),
          "puppy-1"
        ),
        Event.create(
          new EventId("event-2"),
          new EventTitle("Vet Checkup"),
          new EventDescription("Regular health checkup"),
          new EventDateTime(new Date("2024-01-16T10:00:00Z")),
          new EventType(EventTypeEnum.VET_APPOINTMENT),
          "puppy-1"
        ),
        Event.create(
          new EventId("event-3"),
          new EventTitle("Training Session"),
          new EventDescription("Basic obedience training"),
          new EventDateTime(new Date("2024-01-20T14:00:00Z")),
          new EventType(EventTypeEnum.TRAINING),
          "puppy-1"
        ),
      ];

      for (const eventResult of events) {
        expect(eventResult.isSuccess()).to.be.true;
        const event = eventResult.getValue();
        await repository.save(event);
      }
    });

    it("should return events within date range", async () => {
      // Arrange
      const startDate = new Date("2024-01-15T00:00:00Z");
      const endDate = new Date("2024-01-17T00:00:00Z");

      // Act
      const result = await repository.findByDateRange(startDate, endDate);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.have.length(2);
      expect(events[0].id.value).to.equal("event-1");
      expect(events[1].id.value).to.equal("event-2");
    });

    it("should return empty array when no events in date range", async () => {
      // Arrange
      const startDate = new Date("2024-01-25T00:00:00Z");
      const endDate = new Date("2024-01-30T00:00:00Z");

      // Act
      const result = await repository.findByDateRange(startDate, endDate);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.be.an("array").that.is.empty;
    });
  });

  describe("findByType", () => {
    beforeEach(async () => {
      // Arrange - Create events with different types
      const events = [
        Event.create(
          new EventId("event-1"),
          new EventTitle("Morning Feeding"),
          new EventDescription("Regular morning feeding"),
          new EventDateTime(new Date("2024-01-15T08:00:00Z")),
          new EventType(EventTypeEnum.FEEDING),
          "puppy-1"
        ),
        Event.create(
          new EventId("event-2"),
          new EventTitle("Vet Checkup"),
          new EventDescription("Regular health checkup"),
          new EventDateTime(new Date("2024-01-16T10:00:00Z")),
          new EventType(EventTypeEnum.VET_APPOINTMENT),
          "puppy-1"
        ),
        Event.create(
          new EventId("event-3"),
          new EventTitle("Evening Feeding"),
          new EventDescription("Regular evening feeding"),
          new EventDateTime(new Date("2024-01-15T18:00:00Z")),
          new EventType(EventTypeEnum.FEEDING),
          "puppy-2"
        ),
      ];

      for (const eventResult of events) {
        expect(eventResult.isSuccess()).to.be.true;
        const event = eventResult.getValue();
        await repository.save(event);
      }
    });

    it("should return events of specific type", async () => {
      // Arrange
      const eventType = "feeding";

      // Act
      const result = await repository.findByType(eventType);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.have.length(2);
      expect(events[0].eventType.value).to.equal("feeding");
      expect(events[1].eventType.value).to.equal("feeding");
    });

    it("should return empty array when no events of type found", async () => {
      // Arrange
      const eventType = "training";

      // Act
      const result = await repository.findByType(eventType);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.be.an("array").that.is.empty;
    });
  });

  describe("update", () => {
    it("should update existing event", async () => {
      // Arrange
      const eventResult = Event.create(
        new EventId("event-1"),
        new EventTitle("Morning Feeding"),
        new EventDescription("Regular morning feeding"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-1"
      );
      expect(eventResult.isSuccess()).to.be.true;
      const event = eventResult.getValue();
      await repository.save(event);

      const updatedEventResult = Event.create(
        new EventId("event-1"),
        new EventTitle("Updated Morning Feeding"),
        new EventDescription("Updated description"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-1"
      );
      expect(updatedEventResult.isSuccess()).to.be.true;
      const updatedEvent = updatedEventResult.getValue();

      // Act
      const result = await repository.update(updatedEvent);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(updatedEvent);
      expect(result.getValue().title.value).to.equal("Updated Morning Feeding");
    });
  });

  describe("delete", () => {
    it("should delete existing event", async () => {
      // Arrange
      const eventResult = Event.create(
        new EventId("event-1"),
        new EventTitle("Morning Feeding"),
        new EventDescription("Regular morning feeding"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-1"
      );
      expect(eventResult.isSuccess()).to.be.true;
      const event = eventResult.getValue();
      await repository.save(event);

      // Act
      const result = await repository.delete(new EventId("event-1"));

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(repository.getCount()).to.equal(0);
      const findResult = await repository.findById(new EventId("event-1"));
      expect(findResult.isSuccess()).to.be.true;
      expect(findResult.getValue()).to.be.null;
    });

    it("should handle deletion of non-existent event gracefully", async () => {
      // Arrange
      const nonExistentId = new EventId("non-existent");

      // Act
      const result = await repository.delete(nonExistentId);

      // Assert
      expect(result.isSuccess()).to.be.true;
    });
  });

  describe("findUpcomingEvents", () => {
    beforeEach(async () => {
      // Arrange - Create events with different dates
      const now = new Date();
      const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
      const futureDate1 = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
      const futureDate2 = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now

      const events = [
        Event.create(
          new EventId("event-1"),
          new EventTitle("Past Feeding"),
          new EventDescription("Past feeding event"),
          new EventDateTime(pastDate),
          new EventType(EventTypeEnum.FEEDING),
          "puppy-1"
        ),
        Event.create(
          new EventId("event-2"),
          new EventTitle("Upcoming Vet"),
          new EventDescription("Upcoming vet appointment"),
          new EventDateTime(futureDate1),
          new EventType(EventTypeEnum.VET_APPOINTMENT),
          "puppy-1"
        ),
        Event.create(
          new EventId("event-3"),
          new EventTitle("Upcoming Training"),
          new EventDescription("Upcoming training session"),
          new EventDateTime(futureDate2),
          new EventType(EventTypeEnum.TRAINING),
          "puppy-1"
        ),
      ];

      for (const eventResult of events) {
        expect(eventResult.isSuccess()).to.be.true;
        const event = eventResult.getValue();
        await repository.save(event);
      }
    });

    it("should return upcoming events for puppy", async () => {
      // Arrange
      const puppyId = "puppy-1";
      const limit = 10;

      // Act
      const result = await repository.findUpcomingEvents(puppyId, limit);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.have.length(2);
      expect(events[0].id.value).to.equal("event-2");
      expect(events[1].id.value).to.equal("event-3");
    });

    it("should respect limit parameter", async () => {
      // Arrange
      const puppyId = "puppy-1";
      const limit = 1;

      // Act
      const result = await repository.findUpcomingEvents(puppyId, limit);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const events = result.getValue();
      expect(events).to.have.length(1);
      expect(events[0].id.value).to.equal("event-2");
    });

    it("should return empty array when no upcoming events", async () => {
      // Arrange
      const puppyId = "puppy-with-no-upcoming-events";
      const limit = 10;

      // Act
      const result = await repository.findUpcomingEvents(puppyId, limit);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.be.an("array").that.is.empty;
    });
  });

  describe("test helper methods", () => {
    it("should clear all events", async () => {
      // Arrange
      const eventResult = Event.create(
        new EventId("event-1"),
        new EventTitle("Morning Feeding"),
        new EventDescription("Regular morning feeding"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-1"
      );
      expect(eventResult.isSuccess()).to.be.true;
      const event = eventResult.getValue();
      await repository.save(event);

      // Act
      repository.clear();

      // Assert
      expect(repository.getCount()).to.equal(0);
    });

    it("should return correct count", async () => {
      // Arrange
      const event1Result = Event.create(
        new EventId("event-1"),
        new EventTitle("Morning Feeding"),
        new EventDescription("Regular morning feeding"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-1"
      );
      const event2Result = Event.create(
        new EventId("event-2"),
        new EventTitle("Vet Checkup"),
        new EventDescription("Regular health checkup"),
        new EventDateTime(new Date("2024-01-16T10:00:00Z")),
        new EventType(EventTypeEnum.VET_APPOINTMENT),
        "puppy-1"
      );
      expect(event1Result.isSuccess()).to.be.true;
      expect(event2Result.isSuccess()).to.be.true;
      const event1 = event1Result.getValue();
      const event2 = event2Result.getValue();
      await repository.save(event1);
      await repository.save(event2);

      // Act
      const count = repository.getCount();

      // Assert
      expect(count).to.equal(2);
    });

    it("should return all events via getAllEvents", async () => {
      // Arrange
      const event1Result = Event.create(
        new EventId("event-1"),
        new EventTitle("Morning Feeding"),
        new EventDescription("Regular morning feeding"),
        new EventDateTime(new Date("2024-01-15T08:00:00Z")),
        new EventType(EventTypeEnum.FEEDING),
        "puppy-1"
      );
      const event2Result = Event.create(
        new EventId("event-2"),
        new EventTitle("Vet Checkup"),
        new EventDescription("Regular health checkup"),
        new EventDateTime(new Date("2024-01-16T10:00:00Z")),
        new EventType(EventTypeEnum.VET_APPOINTMENT),
        "puppy-1"
      );
      expect(event1Result.isSuccess()).to.be.true;
      expect(event2Result.isSuccess()).to.be.true;
      const event1 = event1Result.getValue();
      const event2 = event2Result.getValue();
      await repository.save(event1);
      await repository.save(event2);

      // Act
      const events = repository.getAllEvents();

      // Assert
      expect(events).to.have.length(2);
      expect(events).to.deep.include(event1);
      expect(events).to.deep.include(event2);
    });
  });
});
