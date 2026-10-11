export const ORIGINAL = "فكرة تطبيق ذكي";

export type Criterion = {
  key: string;
  label: string;
  weight: number;
  test: (t: string) => boolean;
  tip: string;
};

const has = (t: string, words: string[]) => words.some((w) => t.includes(w));

export const CRITERIA: Criterion[] = [
  {
    key: "audience",
    label: "الفئة المستهدفة",
    weight: 25,
    test: (t) =>
      has(t, [
        "طالب", "طلاب", "طالبة", "معلم", "معلمة", "أطفال", "اطفال", "مبتدئ", "مبتدئين",
        "جمهور", "الفئة", "المستهدفة", "المستهدف", "العمر", "المرحلة", "سنة", "موظف",
        "مستخدم", "المستخدمين", "للجميع", "لكل الفئات", "عامة الناس", "شباب", "شخص",
      ]),
    tip: "حدّد الفئة المستهدفة مثل «لطلاب المرحلة الثانوية» أو «لأصحاب المتاجر الصغيرة».",
  },
  {
    key: "goal",
    label: "الهدف من التطبيق",
    weight: 25,
    test: (t) =>
      has(t, [
        "الهدف", "هدف", "غرض", "يساعد", "تساعد", "يسهّل", "يسهل", "تسهيل", "يوفّر",
        "يوفر", "يعلّم", "يعلم", "تعليم", "يحل", "حل مشكلة", "حلّ", "يعالج", "يخدم",
        "يفيد", "فائدة", "لتعلم", "لمراجعة", "لتنظيم", "لمتابعة", "بهدف", "بغرض",
        "مشكلة", "يحفّز", "يحفز",
      ]),
    tip: "اذكر الهدف: ما المشكلة التي يحلها التطبيق أو ماذا يفيد مستخدمه؟",
  },
  {
    key: "details",
    label: "تفاصيل التطبيق",
    weight: 25,
    test: (t) =>
      has(t, [
        "ميزات", "الميزات", "شاشات", "شاشة", "صفحة", "أقسام", "قسم", "وظائف", "خوارزمية",
        "خوارزم", "بيانات", "ذكاء اصطناعي", "تعلّم الآلة", "تعلم الآلة", "تشمل", "يتضمن",
        "تتضمن", "يحتوي", "تقترح", "توصية", "إشعارات", "اشعارات", "تسجيل", "حساب",
        "محاور", "نموذج",
      ]),
    tip: "اذكر تفاصيل التطبيق: الميزات الرئيسية والشاشات وكيفية عمله.",
  },
  {
    key: "design",
    label: "تصميم وتنسيق التطبيق",
    weight: 25,
    test: (t) =>
      has(t, [
        "تصميم", "التصميم", "ألوان", "الوان", "لون", "واجهة", "نقاط", "جدول", "قائمة",
        "تنسيق", "أسلوب", "بسيط", "عصري", "أيقونات", "عناوين", "متجاوب", "هوية",
        "خطوات",
      ]),
    tip: "وضّح التصميم وشكل المخرجات مثل الألوان والقوائم وأسلوب العرض.",
  },
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
  // Share of the achievable gap (from the original score up to 100) that the student closed.
  const gap = 100 - a.score;
  const pct = gap > 0 ? Math.round((diff / gap) * 100) : 0;
  const added = b.met.filter((c) => !a.met.some((m) => m.key === c.key));
  return { a, b, diff, pct, added };
}

export function encouragement(score: number, name: string) {
  const n = name.trim() ? `يا ${name.trim()}` : "";
  if (score >= 90) return `مذهل ${n}! برومبتك احترافي ومتكامل تقريبًا 🌟`;
  if (score >= 70) return `عمل رائع ${n}! أنت على بُعد خطوة من البرومبت المثالي 👏`;
  if (score >= 45) return `بداية جميلة ${n}! أضف عنصرًا أو اثنين وسترى الفرق 💪`;
  return `لا بأس ${n}، كل خبير بدأ من هنا. جرّب إضافة الفئة المستهدفة والهدف ✨`;
}
