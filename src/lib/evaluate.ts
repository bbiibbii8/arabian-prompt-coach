export const ORIGINAL = "اشرح أساسيات الذكاء الاصطناعي";

export type Criterion = {
  key: string;
  label: string;
  weight: number;
  test: (t: string) => boolean;
  tip: string;
};

const has = (t: string, words: string[]) => words.some((w) => t.includes(w));

export const CRITERIA: Criterion[] = [
  { key: "task", label: "مهمة واضحة", weight: 15, test: (t) => has(t, ["اشرح", "وضح", "قدم", "لخص", "عرّف", "عرف", "اكتب", "بسّط", "بسط"]), tip: "ابدأ بفعل واضح يحدد المهمة مثل «اشرح» أو «لخّص»." },
  { key: "audience", label: "الجمهور المستهدف", weight: 15, test: (t) => has(t, ["طالب", "طلاب", "مبتدئ", "مبتدئين", "أطفال", "معلم", "موظف", "جمهور", "عمر", "سنة", "المرحلة", "لشخص", "غير متخصص"]), tip: "حدّد لمن الشرح: مثلًا «لطلاب المرحلة الثانوية المبتدئين»." },
  { key: "examples", label: "أمثلة", weight: 15, test: (t) => has(t, ["مثال", "أمثلة", "امثلة", "مثل", "تطبيقات", "من الحياة"]), tip: "اطلب أمثلة من الحياة اليومية لتقريب الفكرة." },
  { key: "details", label: "تفاصيل ومحاور", weight: 15, test: (t) => has(t, ["تعلم الآلة", "تعلّم الآلة", "الشبكات", "البيانات", "الخوارزم", "تاريخ", "أنواع", "مفهوم", "محاور", "يشمل", "تتضمن", "يتضمن"]), tip: "اذكر المحاور المطلوبة، مثل تعلّم الآلة والبيانات والشبكات العصبية." },
  { key: "constraints", label: "قيود وحدود", weight: 15, test: (t) => has(t, ["كلمة", "كلمات", "لا تتجاوز", "لا يزيد", "بدون", "تجنب", "تجنّب", "فقرات", "سطور", "دقائق", "مصطلحات"]) || /\d+/.test(t), tip: "أضف قيدًا مثل «لا تتجاوز 200 كلمة» أو «تجنّب المصطلحات المعقدة»." },
  { key: "format", label: "تنسيق الإجابة", weight: 15, test: (t) => has(t, ["نقاط", "جدول", "قائمة", "عناوين", "خطوات", "ملخص", "تنسيق", "أسئلة", "اختبار"]), tip: "حدّد شكل الإجابة: نقاط، جدول، أو عناوين مع ملخص ختامي." },
  { key: "tone", label: "الأسلوب والهدف", weight: 10, test: (t) => has(t, ["بأسلوب", "أسلوب", "بسيط", "مبسط", "مبسّط", "ممتع", "رسمي", "ودود", "لكي", "حتى أ", "الهدف", "بهدف"]), tip: "وضّح الأسلوب والهدف: «بأسلوب مبسّط وممتع بهدف التحضير لعرض صفي»." },
];

export type Result = {
  score: number;
  met: Criterion[];
  missing: Criterion[];
};

export function evaluate(text: string): Result {
  const t = text.trim();
  if (!t) return { score: 0, met: [], missing: CRITERIA };
  const met = CRITERIA.filter((c) => c.test(t));
  const missing = CRITERIA.filter((c) => !c.test(t));
  let score = met.reduce((s, c) => s + c.weight, 0);
  // length bonus/penalty for elaboration
  const words = t.split(/\s+/).length;
  if (words < 6) score = Math.min(score, 20);
  return { score: Math.max(0, Math.min(100, score)), met, missing };
}

export function compare(improved: string) {
  const a = evaluate(ORIGINAL);
  const b = evaluate(improved);
  const diff = b.score - a.score;
  const pct = a.score > 0 ? Math.round((diff / a.score) * 100) : 0;
  const added = b.met.filter((c) => !a.met.some((m) => m.key === c.key));
  return { a, b, diff, pct, added };
}

export function encouragement(score: number, name: string) {
  const n = name.trim() ? `يا ${name.trim()}` : "";
  if (score >= 90) return `مذهل ${n}! برومبتك احترافي ومتكامل تقريبًا 🌟`;
  if (score >= 70) return `عمل رائع ${n}! أنت على بُعد خطوة من البرومبت المثالي 👏`;
  if (score >= 45) return `بداية جميلة ${n}! أضف عنصرًا أو اثنين وسترى الفرق 💪`;
  return `لا بأس ${n}، كل خبير بدأ من هنا. جرّب إضافة الجمهور والتنسيق ✨`;
}
