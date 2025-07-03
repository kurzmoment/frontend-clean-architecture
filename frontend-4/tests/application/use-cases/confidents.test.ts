import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllConfidents,
  getConfidentById,
  createNewConfident,
  updateExistingConfident,
  deleteExistingConfident,
} from "../../../app/application/use-cases/confidents";
import type { ConfidentRepository } from "../../../app/domain/repositories/confident-repository";
import type { NotificationService } from "../../../app/application/services/notification-service";
import type {
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../../../app/shared-kernel";

describe("Confident Use Cases", () => {
  let mockConfidentRepository: ConfidentRepository;
  let mockNotificationService: NotificationService;

  beforeEach(() => {
    mockConfidentRepository = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockNotificationService = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    };
  });

  describe("getAllConfidents", () => {
    it("should return all confidents when successful", async () => {
      const mockConfidents = [
        { id: 1, name: "John Doe", user_id: 1 },
        { id: 2, name: "Jane Smith", user_id: 1 },
      ];

      mockConfidentRepository.getAll.mockResolvedValue(mockConfidents);

      const result = await getAllConfidents(
        mockConfidentRepository,
        mockNotificationService
      );

      expect(result).toEqual(mockConfidents);
      expect(mockConfidentRepository.getAll).toHaveBeenCalledOnce();
      expect(mockNotificationService.error).not.toHaveBeenCalled();
    });

    it("should handle errors and show notification", async () => {
      const error = new Error("Database error");
      mockConfidentRepository.getAll.mockRejectedValue(error);

      await expect(
        getAllConfidents(mockConfidentRepository, mockNotificationService)
      ).rejects.toThrow("Failed to fetch confidents");

      expect(mockNotificationService.error).toHaveBeenCalledWith(
        "Failed to fetch confidents"
      );
    });
  });

  describe("getConfidentById", () => {
    it("should return confident when found", async () => {
      const mockConfident = { id: 1, name: "John Doe", user_id: 1 };
      mockConfidentRepository.getById.mockResolvedValue(mockConfident);

      const result = await getConfidentById(
        1,
        mockConfidentRepository,
        mockNotificationService
      );

      expect(result).toEqual(mockConfident);
      expect(mockConfidentRepository.getById).toHaveBeenCalledWith(1);
      expect(mockNotificationService.error).not.toHaveBeenCalled();
    });

    it("should handle errors and show notification", async () => {
      const error = new Error("Not found");
      mockConfidentRepository.getById.mockRejectedValue(error);

      await expect(
        getConfidentById(999, mockConfidentRepository, mockNotificationService)
      ).rejects.toThrow("Confident not found");

      expect(mockNotificationService.error).toHaveBeenCalledWith(
        "Confident not found"
      );
    });
  });

  describe("createNewConfident", () => {
    it("should create confident successfully", async () => {
      const confidentData: CreateConfidentRequest = {
        name: "John Doe",
        email: "john@example.com",
        company: "Tech Corp",
      };

      const createdConfident = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        company: "Tech Corp",
        user_id: 1,
      };

      mockConfidentRepository.create.mockResolvedValue({
        confident: createdConfident,
      });

      const result = await createNewConfident(
        confidentData,
        1,
        mockConfidentRepository,
        mockNotificationService
      );

      expect(result).toEqual(createdConfident);
      expect(mockConfidentRepository.create).toHaveBeenCalledWith({
        ...confidentData,
        user_id: 1,
      });
      expect(mockNotificationService.success).toHaveBeenCalledWith(
        "Confident created successfully!"
      );
    });

    it("should handle validation errors", async () => {
      const invalidData: CreateConfidentRequest = {
        name: "", // Invalid: empty name
        email: "john@example.com",
      };

      await expect(
        createNewConfident(
          invalidData,
          1,
          mockConfidentRepository,
          mockNotificationService
        )
      ).rejects.toThrow("Failed to create confident");

      expect(mockNotificationService.error).toHaveBeenCalledWith(
        "Failed to create confident"
      );
    });

    it("should handle repository errors", async () => {
      const confidentData: CreateConfidentRequest = {
        name: "John Doe",
        email: "john@example.com",
      };

      const error = new Error("Database error");
      mockConfidentRepository.create.mockRejectedValue(error);

      await expect(
        createNewConfident(
          confidentData,
          1,
          mockConfidentRepository,
          mockNotificationService
        )
      ).rejects.toThrow("Failed to create confident");

      expect(mockNotificationService.error).toHaveBeenCalledWith(
        "Failed to create confident"
      );
    });
  });

  describe("updateExistingConfident", () => {
    it("should update confident successfully", async () => {
      const updateData: UpdateConfidentRequest = {
        name: "John Updated",
        email: "john.updated@example.com",
      };

      mockConfidentRepository.update.mockResolvedValue(undefined);

      await updateExistingConfident(
        1,
        updateData,
        mockConfidentRepository,
        mockNotificationService
      );

      expect(mockConfidentRepository.update).toHaveBeenCalledWith(
        1,
        updateData
      );
      expect(mockNotificationService.success).toHaveBeenCalledWith(
        "Confident updated successfully!"
      );
    });

    it("should handle update errors", async () => {
      const updateData: UpdateConfidentRequest = {
        name: "John Updated",
      };

      const error = new Error("Update failed");
      mockConfidentRepository.update.mockRejectedValue(error);

      await expect(
        updateExistingConfident(
          1,
          updateData,
          mockConfidentRepository,
          mockNotificationService
        )
      ).rejects.toThrow("Failed to update confident");

      expect(mockNotificationService.error).toHaveBeenCalledWith(
        "Failed to update confident"
      );
    });
  });

  describe("deleteExistingConfident", () => {
    it("should delete confident successfully", async () => {
      mockConfidentRepository.delete.mockResolvedValue(undefined);

      await deleteExistingConfident(
        1,
        mockConfidentRepository,
        mockNotificationService
      );

      expect(mockConfidentRepository.delete).toHaveBeenCalledWith(1);
      expect(mockNotificationService.success).toHaveBeenCalledWith(
        "Confident deleted successfully!"
      );
    });

    it("should handle delete errors", async () => {
      const error = new Error("Delete failed");
      mockConfidentRepository.delete.mockRejectedValue(error);

      await expect(
        deleteExistingConfident(
          1,
          mockConfidentRepository,
          mockNotificationService
        )
      ).rejects.toThrow("Failed to delete confident");

      expect(mockNotificationService.error).toHaveBeenCalledWith(
        "Failed to delete confident"
      );
    });
  });
});
