import { describe, it, expect } from "vitest";
import { compare, evaluate, ORIGINAL } from "@/lib/evaluate";

describe("evaluate", () => {
  it("original prompt scores low", () => {
    expect(evaluate(ORIGINAL).score).toBeLessThanOrEqual(20);
  });
  it("rich prompt scores 100 and improves", () => {
    const p = "اشرح أساسيات الذكاء الاصطناعي لطلاب المرحلة الثانوية المبتدئين بأسلوب مبسّط، مع أمثلة من الحياة اليومية، يتضمن تعلم الآلة والبيانات، في نقاط لا تتجاوز 200 كلمة";
    const r = compare(p);
    expect(r.b.score).toBe(100);
    expect(r.diff).toBe(100 - r.a.score);
  });
});
