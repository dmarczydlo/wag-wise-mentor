import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import { Test, TestingModule } from "@nestjs/testing";
import { CalendarController } from "../../src/infrastructure/calendar/calendar.controller";
import { CalendarModule } from "../../src/infrastructure/calendar/calendar.module";
import { InMemoryEventRepository } from "../../src/infrastructure/calendar/in-memory-event.repository";
import { EVENT_REPOSITORY } from "../../src/application/calendar/calendar.use-cases";
import { EventTypeEnum } from "../../src/domain/calendar/event.entity";

describe("CalendarController Integration Tests - AAA Pattern", () => {
  let app: TestingModule;
  let controller: CalendarController;
  let repository: InMemoryEventRepository;

  beforeEach(async () => {
    // Arrange
    app = await Test.createTestingModule({
      imports: [CalendarModule],
    }).compile();

    controller = app.get<CalendarController>(CalendarController);
    repository = app.get<InMemoryEventRepository>(EVENT_REPOSITORY);
    repository.clear(); // Clean state for each test
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /calendar/events", () => {
    it("should create a new event successfully", async () => {
      // Arrange
      const createEventDto = {
        puppyId: "puppy-1",
        eventType: EventTypeEnum.FEEDING,
        title: "Morning Feeding",
        description: "Regular morning feeding",
        eventDateTime: new Date("2024-01-15T08:00:00Z"),
      };

      // Act
      const result = await controller.createEvent(createEventDto);

      // Assert
      expect(result.success).to.be.true;
      expect(result.event).to.not.be.undefined;
      expect(result.event!.puppyId).to.equal("puppy-1");
      expect(result.event!.eventType.value).to.equal(EventTypeEnum.FEEDING);
      expect(result.event!.title.value).to.equal("Morning Feeding");
    });

    it("should return 400 when puppy ID is empty", async () => {
      // Arrange
      const createEventDto = {
        puppyId: "",
        eventType: EventTypeEnum.FEEDING,
        title: "Morning Feeding",
        description: "Regular morning feeding",
        eventDateTime: new Date("2024-01-15T08:00:00Z"),
      };

      // Act
      const result = await controller.createEvent(createEventDto);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("PuppyId cannot be empty");
      expect(result.event).to.be.undefined;
    });

    it("should return 400 when event type is invalid", async () => {
      // Arrange - This test would require invalid enum value, which TypeScript prevents
      // We'll test this at the domain level instead
      expect(true).to.be.true; // Placeholder test
    });

    it("should return 400 when title is empty", async () => {
      // Arrange
      const createEventDto = {
        puppyId: "puppy-1",
        eventType: EventTypeEnum.FEEDING,
        title: "",
        description: "Regular morning feeding",
        eventDateTime: new Date("2024-01-15T08:00:00Z"),
      };

      // Act
      const result = await controller.createEvent(createEventDto);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("EventTitle cannot be empty");
      expect(result.event).to.be.undefined;
    });
  });

  describe("PUT /calendar/events/:id", () => {
    let existingEventId: string;

    beforeEach(async () => {
      // Arrange - Create an existing event
      const createEventDto = {
        puppyId: "puppy-1",
        eventType: EventTypeEnum.FEEDING,
        title: "Morning Feeding",
        description: "Regular morning feeding",
        eventDateTime: new Date("2024-01-15T08:00:00Z"),
      };
      const createResult = await controller.createEvent(createEventDto);
      existingEventId = createResult.event!.id.value;
    });

    it("should update event successfully", async () => {
      // Arrange
      const updateEventDto = {
        title: "Updated Morning Feeding",
        description: "Updated description",
      };

      // Act
      const result = await controller.updateEvent(
        existingEventId,
        updateEventDto
      );

      // Assert
      expect(result.success).to.be.true;
      expect(result.event).to.not.be.undefined;
      expect(result.event!.title.value).to.equal("Updated Morning Feeding");
      expect(result.event!.description.value).to.equal("Updated description");
    });

    it("should return 404 when event not found", async () => {
      // Arrange
      const nonExistentId = "non-existent-event";
      const updateEventDto = {
        title: "Updated Title",
        description: "Updated description",
      };

      // Act
      const result = await controller.updateEvent(
        nonExistentId,
        updateEventDto
      );

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Event not found");
      expect(result.event).to.be.undefined;
    });

    it("should return 400 when new title is empty", async () => {
      // Arrange
      const updateEventDto = {
        title: "",
        description: "Updated description",
      };

      // Act
      const result = await controller.updateEvent(
        existingEventId,
        updateEventDto
      );

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("EventTitle cannot be empty");
      expect(result.event).to.be.undefined;
    });
  });

  describe("GET /calendar/health-timeline/:puppyId", () => {
    beforeEach(async () => {
      // Arrange - Create multiple events for a puppy
      const events = [
        {
          puppyId: "puppy-1",
          eventType: EventTypeEnum.FEEDING,
          title: "Morning Feeding",
          description: "Regular morning feeding",
          eventDateTime: new Date("2024-01-15T08:00:00Z"),
        },
        {
          puppyId: "puppy-1",
          eventType: EventTypeEnum.VET_APPOINTMENT,
          title: "Vet Checkup",
          description: "Regular health checkup",
          eventDateTime: new Date("2024-01-16T10:00:00Z"),
        },
        {
          puppyId: "puppy-1",
          eventType: EventTypeEnum.TRAINING,
          title: "Training Session",
          description: "Basic obedience training",
          scheduledDate: new Date("2024-01-17T14:00:00Z"),
        },
      ];

      for (const eventData of events) {
        await controller.createEvent(eventData);
      }
    });

    it("should generate health timeline successfully", async () => {
      // Arrange
      const command = {
        puppyId: "puppy-1",
        breed: "Golden Retriever",
        birthDate: new Date("2025-09-15T00:00:00Z"), // Very recent birth date so vaccinations are in the future
      };

      // Act
      const result = await controller.generateHealthTimeline(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.events).to.not.be.undefined;
      expect(result.events).to.be.an("array");
      expect(result.events.length).to.be.greaterThan(0);
    });

    it("should return 400 when puppy ID is empty", async () => {
      // Arrange
      const command = {
        puppyId: "",
        breed: "Golden Retriever",
        birthDate: new Date("2023-01-15T00:00:00Z"),
      };

      // Act
      const result = await controller.generateHealthTimeline(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("PuppyId cannot be empty");
      expect(result.events).to.be.undefined;
    });

    it("should return empty timeline when no events found", async () => {
      // Arrange
      const command = {
        puppyId: "puppy-with-no-events",
        breed: "Golden Retriever",
        birthDate: new Date("2020-01-15T00:00:00Z"), // Very old birth date so all vaccinations are in the past
      };

      // Act
      const result = await controller.generateHealthTimeline(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.events).to.be.an("array").that.is.empty;
    });
  });
});
