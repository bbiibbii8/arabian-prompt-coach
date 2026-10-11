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
  it("stay short clues that never write the prompt for the student", () => {
    expect(HINTS).toEqual([
      "الفئة المستهدفة",
      "الهدف من التطبيق",
      "تفاصيل التطبيق",
      "تصميم وتنسيق التطبيق",
    ]);
    for (const h of HINTS) {
      expect(h.trim().split(/\s+/).length).toBeLessThanOrEqual(4);
    }
  });
});
