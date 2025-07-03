import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "../../../app/api/api-client";

// Mock fetch globally
global.fetch = vi.fn();

describe("API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document.cookie
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  describe("GET requests", () => {
    it("should make successful GET request", async () => {
      const mockResponse = { data: "test data" };
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: "OK",
        json: vi.fn().mockResolvedValue(mockResponse),
      };

      (fetch as any).mockResolvedValue(mockFetchResponse);

      const result = await apiClient.get("/test");

      expect(fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          method: "GET",
          credentials: "include",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
      expect(result).toEqual({
        ok: true,
        data: mockResponse,
        status: 200,
        statusText: "OK",
      });
    });

    it("should include auth headers when token is present", async () => {
      // Set auth token in cookie
      document.cookie = "authToken=test-token";

      const mockResponse = { data: "test data" };
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: "OK",
        json: vi.fn().mockResolvedValue(mockResponse),
      };

      (fetch as any).mockResolvedValue(mockFetchResponse);

      await apiClient.get("/test");

      expect(fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        })
      );
    });

    it("should handle network errors", async () => {
      (fetch as any).mockRejectedValue(new Error("Network error"));

      const result = await apiClient.get("/test");

      expect(result).toEqual({
        ok: false,
        data: { message: "Network error" },
        status: 0,
        statusText: "Network error",
      });
    });

    it("should handle non-JSON responses", async () => {
      const mockFetchResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: vi.fn().mockRejectedValue(new Error("Not JSON")),
      };

      (fetch as any).mockResolvedValue(mockFetchResponse);

      const result = await apiClient.get("/test");

      expect(result).toEqual({
        ok: false,
        data: { message: "Internal Server Error" },
        status: 500,
        statusText: "Internal Server Error",
      });
    });
  });

  describe("POST requests", () => {
    it("should make successful POST request with data", async () => {
      const postData = { name: "test", email: "test@example.com" };
      const mockResponse = { id: 1, ...postData };
      const mockFetchResponse = {
        ok: true,
        status: 201,
        statusText: "Created",
        json: vi.fn().mockResolvedValue(mockResponse),
      };

      (fetch as any).mockResolvedValue(mockFetchResponse);

      const result = await apiClient.post("/test", postData);

      expect(fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(postData),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
      expect(result).toEqual({
        ok: true,
        data: mockResponse,
        status: 201,
        statusText: "Created",
      });
    });

    it("should make POST request without data", async () => {
      const mockResponse = { success: true };
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: "OK",
        json: vi.fn().mockResolvedValue(mockResponse),
      };

      (fetch as any).mockResolvedValue(mockFetchResponse);

      const result = await apiClient.post("/test");

      expect(fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          method: "POST",
          body: undefined,
        })
      );
      expect(result.ok).toBe(true);
    });
  });

  describe("PUT requests", () => {
    it("should make successful PUT request", async () => {
      const putData = { name: "updated" };
      const mockResponse = { id: 1, ...putData };
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: "OK",
        json: vi.fn().mockResolvedValue(mockResponse),
      };

      (fetch as any).mockResolvedValue(mockFetchResponse);

      const result = await apiClient.put("/test/1", putData);

      expect(fetch).toHaveBeenCalledWith(
        "/api/test/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(putData),
        })
      );
      expect(result.ok).toBe(true);
    });
  });

  describe("DELETE requests", () => {
    it("should make successful DELETE request", async () => {
      const mockResponse = { message: "Deleted successfully" };
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: "OK",
        json: vi.fn().mockResolvedValue(mockResponse),
      };

      (fetch as any).mockResolvedValue(mockFetchResponse);

      const result = await apiClient.delete("/test/1");

      expect(fetch).toHaveBeenCalledWith(
        "/api/test/1",
        expect.objectContaining({
          method: "DELETE",
        })
      );
      expect(result.ok).toBe(true);
    });
  });

  describe("Server-side requests", () => {
    it("should use client base URL in jsdom environment", async () => {
      // In jsdom, window is always defined, so client URL is used
      const mockResponse = { data: "test" };
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: "OK",
        json: vi.fn().mockResolvedValue(mockResponse),
      };

      (fetch as any).mockResolvedValue(mockFetchResponse);

      const serverRequest = new Request("http://localhost:3000", {
        headers: { Cookie: "authToken=server-token" },
      });

      await apiClient.get("/test", serverRequest);

      expect(fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });
  });
});
