import { describe, it, expect } from "vitest";
import { compare, evaluate, CRITERIA, ORIGINAL } from "@/lib/evaluate";

describe("evaluate", () => {
  it("has exactly the four criteria with equal weights", () => {
    expect(CRITERIA.map((c) => c.key)).toEqual(["audience", "goal", "details", "design"]);
    expect(CRITERIA.reduce((s, c) => s + c.weight, 0)).toBe(100);
  });
  it("original prompt scores low", () => {
    expect(evaluate(ORIGINAL).score).toBeLessThanOrEqual(20);
  });
  it("rich prompt scores 100 and improves", () => {
    const p =
      "تطبيق ذكي لطلاب المرحلة الثانوية يساعد على حل مسائل الرياضيات، يتضمن شاشة تدريبات وشرح خطوة بخطوة، بتصميم بسيط بألوان مريحة، والنتيجة تُعرض في نقاط";
    const r = compare(p);
    expect(r.b.score).toBe(100);
    expect(r.diff).toBe(100 - r.a.score);
  });
  it("percentage is the share of the achievable gap that was closed", () => {
    const r = compare("تطبيق ذكي لطلاب المرحلة الثانوية");
    expect(r.b.score).toBe(25);
    expect(r.pct).toBe(25);
  });
  it("percentage stays finite when nothing can be improved", () => {
    const r = compare("تطبيق ذكي لطلاب المرحلة الثانوية");
    expect(r.a.score).toBe(0);
    expect(Number.isFinite(r.pct)).toBe(true);
  });
});
