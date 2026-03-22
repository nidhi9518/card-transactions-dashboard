import { describe, it, expect, vi, beforeEach } from "vitest";
import { Http } from "./Http";

describe("Http client", () => {
  const baseUrl = "https://test.com";
  let http: Http;

  beforeEach(() => {
    http = new Http(baseUrl);
    vi.restoreAllMocks();
  });

  it("initializes with default headers", () => {
    const client = new Http(baseUrl);
    expect(client["headers"]).toEqual({
      "Content-Type": "application/json",
    });
  });

  it("merges custom headers", () => {
    const client = new Http(baseUrl, { Authorization: "Bearer token" });
    expect(client["headers"]).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer token",
    });
  });

  it("performs a GET request successfully", async () => {
    const mockResponse = { id: 1, name: "Test" };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    const result = await http.get("users/1");
    expect(fetch).toHaveBeenCalledWith(
      `${baseUrl}/users/1`,
      expect.objectContaining({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("throws an error when GET response is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve("Not Found"),
    });
    await expect(http.get("missing")).rejects.toThrow("Not Found");
  });

});
