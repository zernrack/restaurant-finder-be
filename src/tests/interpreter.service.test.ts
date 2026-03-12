import { describe, it, expect, vi, beforeEach } from "vitest";
import { interpretMessage } from "../services/interpreter.service.js";
import * as llm from "../utils/llm.js";

vi.mock("../utils/llm.js");

const mockAskLlm = vi.mocked(llm.askLlm);

describe("interpretMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parses a full valid LLM JSON response", async () => {
    mockAskLlm.mockResolvedValue(
      JSON.stringify({
        query: "sushi",
        near: "Los Angeles",
        price: 1,
        open_now: true,
      }),
    );

    const result = await interpretMessage("cheap sushi in Los Angeles open now");

    expect(result).toEqual({
      query: "sushi",
      near: "Los Angeles",
      price: 1,
      open_now: true,
    });
  });

  it("parses response when optional fields are missing", async () => {
    mockAskLlm.mockResolvedValue(JSON.stringify({ query: "pizza" }));

    const result = await interpretMessage("pizza");

    expect(result.query).toBe("pizza");
    expect(result.near).toBeUndefined();
    expect(result.price).toBeUndefined();
    expect(result.open_now).toBeUndefined();
  });

  it("throws when LLM returns no JSON", async () => {
    mockAskLlm.mockResolvedValue("Sorry, I cannot help.");

    await expect(interpretMessage("anything")).rejects.toThrow(
      "LLM did not return JSON",
    );
  });

  it("throws when LLM returns JSON that fails schema validation", async () => {
    mockAskLlm.mockResolvedValue(JSON.stringify({ price: "cheap" }));

    await expect(interpretMessage("something")).rejects.toThrow();
  });
});
