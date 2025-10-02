import { describe, it } from "mocha";
import { expect } from "chai";

describe("Basic Test", () => {
  it("should pass basic assertion", () => {
    // Arrange
    const value = "test";

    // Act
    const result = value.toUpperCase();

    // Assert
    expect(result).to.equal("TEST");
  });
});
