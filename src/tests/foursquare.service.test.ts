import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchRestaurants } from "../services/foursquare.service.js";
import type { FoursquarePlaceDetails, FoursquareSearchResult } from "../models/foursquare.model.js";

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }));

vi.mock("../utils/foursquareClient.js", () => ({
  foursquareClient: { get: mockGet },
}));

const mockSearchResult: FoursquareSearchResult = {
  fsq_place_id: "abc123",
  name: "Sushi Bar",
};

const mockDetails: FoursquarePlaceDetails = {
  id: "abc123",
  name: "Sushi Bar",
  rating: 8.5,
  price: 1,
  categories: [{ id: 1, name: "Japanese" }],
  location: { formatted_address: "123 Main St, Los Angeles, CA" },
  hours: { open_now: true, display: ["Mon–Fri 11am–10pm"] },
  website: "https://sushibar.example.com",
};

describe("searchRestaurants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns mapped restaurants from search + details calls", async () => {
    mockGet
      .mockResolvedValueOnce({ data: { results: [mockSearchResult] } })
      .mockResolvedValueOnce({ data: mockDetails });

    const results = await searchRestaurants({
      query: "sushi",
      near: "Los Angeles",
      price: 1,
      open_now: true,
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "abc123",
      name: "Sushi Bar",
      rating: 8.5,
      priceLevel: 1,
      category: "Japanese",
      address: "123 Main St, Los Angeles, CA",
      openNow: true,
      hours: ["Mon–Fri 11am–10pm"],
      website: "https://sushibar.example.com",
    });
  });

  it("returns empty array when no places found", async () => {
    mockGet.mockResolvedValueOnce({ data: { results: [] } });

    const results = await searchRestaurants({ query: "ramen" });

    expect(results).toEqual([]);
  });

  it("maps optional fields safely when missing from details", async () => {
    const minimalDetails: FoursquarePlaceDetails = { id: "xyz", name: "Cafe" };

    mockGet
      .mockResolvedValueOnce({ data: { results: [{ fsq_place_id: "xyz", name: "Cafe" }] } })
      .mockResolvedValueOnce({ data: minimalDetails });

    const results = await searchRestaurants({ query: "cafe" });

    expect(results[0]).toMatchObject({ id: "xyz", name: "Cafe" });
    expect(results[0]?.rating).toBeUndefined();
    expect(results[0]?.address).toBeUndefined();
    expect(results[0]?.openNow).toBeUndefined();
  });
});
