import { describe, it, expect } from "vitest";
import {
  createConfident,
  isConfidentValid,
  getConfidentDisplayName,
  hasContactInfo,
} from "../../../app/shared-kernel";
import type {
  CreateConfidentRequest,
  Confident,
} from "../../../app/shared-kernel";

describe("Confident Domain Model", () => {
  describe("createConfident", () => {
    it("should create a confident with valid data", () => {
      const data: CreateConfidentRequest = {
        name: "Test Confident",
        email: "test@example.com",
        phone: "123-456-7890",
        company: "Test Company",
        position: "Developer",
        notes: "Test notes",
      };

      const result = createConfident({ ...data, user_id: 1 });

      expect(result).toEqual({
        id: 0,
        name: "Test Confident",
        email: "test@example.com",
        phone: "123-456-7890",
        company: "Test Company",
        position: "Developer",
        notes: "Test notes",
        user_id: 1,
        created_at: undefined,
        updated_at: undefined,
      });
    });

    it("should set id to 0 for new confidents", () => {
      const data: CreateConfidentRequest = {
        name: "Test Confident",
      };

      const result = createConfident({ ...data, user_id: 1 });

      expect(result.id).toBe(0);
    });

    it("should handle optional fields", () => {
      const data: CreateConfidentRequest = {
        name: "Test Confident",
      };

      const result = createConfident({ ...data, user_id: 1 });

      expect(result).toEqual({
        id: 0,
        name: "Test Confident",
        email: undefined,
        phone: undefined,
        company: undefined,
        position: undefined,
        notes: undefined,
        user_id: 1,
        created_at: undefined,
        updated_at: undefined,
      });
    });
  });

  describe("isConfidentValid", () => {
    it("should return true for valid confident", () => {
      const confident: Confident = {
        id: 1,
        name: "Valid Name",
        user_id: 1,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      expect(isConfidentValid(confident)).toBe(true);
    });

    it("should return false for confident with empty name", () => {
      const confident: Confident = {
        id: 1,
        name: "",
        user_id: 1,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      expect(isConfidentValid(confident)).toBe(false);
    });

    it("should return false for confident with invalid user_id", () => {
      const confident: Confident = {
        id: 1,
        name: "Valid Name",
        user_id: 0, // Invalid: must be positive
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      expect(isConfidentValid(confident)).toBe(false);
    });
  });

  describe("getConfidentDisplayName", () => {
    it("should return name only when no company or position", () => {
      const confident: Confident = {
        id: 1,
        name: "John Doe",
        user_id: 1,
      };

      expect(getConfidentDisplayName(confident)).toBe("John Doe");
    });

    it("should include company when available", () => {
      const confident: Confident = {
        id: 1,
        name: "John Doe",
        company: "Tech Corp",
        user_id: 1,
      };

      expect(getConfidentDisplayName(confident)).toBe("John Doe - Tech Corp");
    });

    it("should include position when available", () => {
      const confident: Confident = {
        id: 1,
        name: "John Doe",
        position: "Developer",
        user_id: 1,
      };

      expect(getConfidentDisplayName(confident)).toBe("John Doe - Developer");
    });

    it("should include both company and position when available", () => {
      const confident: Confident = {
        id: 1,
        name: "John Doe",
        company: "Tech Corp",
        position: "Developer",
        user_id: 1,
      };

      expect(getConfidentDisplayName(confident)).toBe(
        "John Doe - Developer at Tech Corp"
      );
    });
  });

  describe("hasContactInfo", () => {
    it("should return true when email is present", () => {
      const confident: Confident = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        user_id: 1,
      };

      expect(hasContactInfo(confident)).toBe(true);
    });

    it("should return true when phone is present", () => {
      const confident: Confident = {
        id: 1,
        name: "John Doe",
        phone: "123-456-7890",
        user_id: 1,
      };

      expect(hasContactInfo(confident)).toBe(true);
    });

    it("should return true when both email and phone are present", () => {
      const confident: Confident = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        user_id: 1,
      };

      expect(hasContactInfo(confident)).toBe(true);
    });

    it("should return false when neither email nor phone is present", () => {
      const confident: Confident = {
        id: 1,
        name: "John Doe",
        user_id: 1,
      };

      expect(hasContactInfo(confident)).toBe(false);
    });
  });
});
