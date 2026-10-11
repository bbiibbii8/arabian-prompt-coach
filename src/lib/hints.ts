// Display-only suggestions. Students read these and write their own wording —
// nothing here is inserted into the prompt box, so the competition stays fair.
export type Hint = { label: string; example: string };

export const HINTS: Hint[] = [
  { label: "الجمهور", example: "لطلاب المرحلة الثانوية المبتدئين" },
  { label: "أمثلة", example: "مع أمثلة من الحياة اليومية" },
  { label: "محاور", example: "المستخدم المستهدف، الميزات الرئيسية، خوارزمية التوصية" },
  { label: "قيود", example: "لا تتجاوز 250 كلمة وتجنّب المصطلحات المعقدة" },
  { label: "تنسيق", example: "في نقاط مع عناوين وملخص ختامي" },
  { label: "أسلوب", example: "بأسلوب مبسّط وممتع" },
];
