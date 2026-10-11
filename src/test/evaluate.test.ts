import { describe, it, expect } from "vitest";
import { compare, evaluate, ORIGINAL } from "@/lib/evaluate";

describe("evaluate", () => {
  it("original prompt scores low", () => {
    expect(evaluate(ORIGINAL).score).toBeLessThanOrEqual(20);
  });
  it("rich prompt scores 100 and improves", () => {
    const p = "اشرح فكرة تطبيق ذكي لطلاب المرحلة الثانوية المبتدئين بأسلوب مبسّط، مع أمثلة من الحياة اليومية، يتضمن المستخدم المستهدف والميزات الرئيسية، في نقاط لا تتجاوز 200 كلمة";
    const r = compare(p);
    expect(r.b.score).toBe(100);
    expect(r.diff).toBe(100 - r.a.score);
  });
  it("percentage is the share of the achievable gap that was closed", () => {
    const r = compare("اشرح فكرة تطبيق ذكي لطلاب المرحلة الثانوية المبتدئين");
    expect(r.b.score).toBe(30);
    expect(r.pct).toBe(30);
  });
  it("percentage stays finite when nothing can be improved", () => {
    const r = compare("اشرح فكرة تطبيق ذكي لطلاب المرحلة الثانوية المبتدئين في نقاط");
    expect(r.a.score).toBe(0);
    expect(Number.isFinite(r.pct)).toBe(true);
  });
});
