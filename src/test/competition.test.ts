import { describe, it, expect } from "vitest";
import { canPublishToBoard } from "@/lib/competition";
import { HINTS } from "@/lib/hints";

describe("board rules", () => {
  it("publishes a signed entry that improved the score", () => {
    expect(canPublishToBoard({ name: "سارة", score: 45 })).toBe(true);
  });
  it("refuses an entry without a name", () => {
    expect(canPublishToBoard({ name: "   ", score: 100 })).toBe(false);
  });
  it("refuses an entry that did not improve anything", () => {
    expect(canPublishToBoard({ name: "سارة", score: 0 })).toBe(false);
  });
});

describe("hints", () => {
  it("stay short clues, not ready-made prompts", () => {
    for (const h of HINTS) {
      expect(h.example.trim().split(/\s+/).length).toBeLessThanOrEqual(12);
    }
  });
});
