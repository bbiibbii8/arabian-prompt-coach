import { describe, it, expect } from "vitest";
import { canPublishToBoard, qualifiesForNoHelpBoard } from "@/lib/competition";

describe("board rules", () => {
  it("publishes a signed entry that improved the score", () => {
    expect(canPublishToBoard({ name: "سارة", score: 45, helped: false })).toBe(true);
  });
  it("refuses an entry without a name", () => {
    expect(canPublishToBoard({ name: "   ", score: 100, helped: false })).toBe(false);
  });
  it("refuses an entry that did not improve anything", () => {
    expect(canPublishToBoard({ name: "سارة", score: 0, helped: false })).toBe(false);
  });
  it("keeps quick-add users out of the no-help competition", () => {
    expect(qualifiesForNoHelpBoard({ name: "سارة", score: 100, helped: true })).toBe(false);
    expect(qualifiesForNoHelpBoard({ name: "سارة", score: 100, helped: false })).toBe(true);
    expect(qualifiesForNoHelpBoard({ name: "", score: 100, helped: false })).toBe(false);
  });
});
