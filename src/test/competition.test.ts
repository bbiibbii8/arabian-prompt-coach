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
  it("stay one-word clues, never a written-out prompt", () => {
    for (const h of HINTS) {
      expect(h.trim().split(/\s+/).length).toBe(1);
    }
  });
});
