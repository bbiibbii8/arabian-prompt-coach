import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CRITERIA, ORIGINAL, compare, encouragement } from "@/lib/evaluate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "طوّر برومبتك — أساسيات الذكاء الاصطناعي" },
      { name: "description", content: "لعبة تفاعلية لتحسين البرومبت وتقييمه بمعايير واضحة." },
      { property: "og:title", content: "طوّر برومبتك" },
      { property: "og:description", content: "حسّن طلبك للذكاء الاصطناعي واحصل على تقييم فوري." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const HINTS = [
  { label: "الجمهور", text: " لطلاب المرحلة الثانوية المبتدئين" },
  { label: "أمثلة", text: "، مع أمثلة من الحياة اليومية" },
  { label: "تفاصيل", text: "، يتضمن تعلم الآلة والبيانات والشبكات العصبية" },
  { label: "قيود", text: "، لا تتجاوز 250 كلمة وتجنّب المصطلحات المعقدة" },
  { label: "تنسيق", text: "، في نقاط مع عناوين وملخص ختامي" },
  { label: "أسلوب", text: "، بأسلوب مبسّط وممتع" },
];

function Index() {
  const [text, setText] = useState(ORIGINAL);
  const [name, setName] = useState("");
  const [res, setRes] = useState<ReturnType<typeof compare> | null>(null);

  const run = () => {
    setRes(compare(text));
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
  };
  const reset = () => { setText(ORIGINAL); setRes(null); };

  return (
    <div dir="rtl" className="min-h-screen bg-hero font-arabic text-foreground">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-16">
        <header className="text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="inline-block rounded-full bg-primary/15 px-4 py-1 text-sm text-primary-glow">فعالية أساسيات الذكاء الاصطناعي</span>
          <h1 className="mt-4 text-4xl font-extrabold md:text-6xl text-gradient">طوّر برومبتك</h1>
          <p className="mt-3 text-muted-foreground">حوّل طلبًا بسيطًا إلى برومبت احترافي، واكتشف كم تحسّن!</p>
        </header>

        <section className="card-glass mt-10 p-5 md:p-8">
          <p className="text-sm text-muted-foreground">الطلب الأصلي:</p>
          <p className="mt-1 text-xl font-bold">«{ORIGINAL}»</p>

          <label className="mt-6 block text-sm font-semibold">اسمك (اختياري)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلًا: سارة"
            className="mt-2 w-full rounded-xl border border-border bg-input/40 px-4 py-2 outline-none focus:ring-2 focus:ring-ring" />

          <label className="mt-5 block text-sm font-semibold">اكتب نسختك المحسّنة</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6}
            className="mt-2 w-full resize-y rounded-xl border border-border bg-input/40 p-4 leading-8 outline-none focus:ring-2 focus:ring-ring" />

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center">أضف سريعًا:</span>
            {HINTS.map((h) => (
              <button key={h.label} onClick={() => setText((t) => t.trim() + h.text)}
                className="rounded-full border border-primary/40 px-3 py-1 text-sm transition hover:bg-primary/20 active:scale-95">+ {h.label}</button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={run} disabled={!text.trim()}
              className="btn-hero rounded-xl px-8 py-3 text-lg font-bold transition hover:scale-[1.03] active:scale-95 disabled:opacity-50">قيّم التحسين</button>
            <button onClick={reset} className="rounded-xl border border-border px-6 py-3 transition hover:bg-secondary">ابدأ من جديد</button>
          </div>
        </section>

        {res && (
          <section id="results" className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="grid gap-4 md:grid-cols-2">
              <PromptCard title="البرومبت الأصلي" text={ORIGINAL} score={res.a.score} />
              <PromptCard title="البرومبت المحسّن" text={text} score={res.b.score} highlight />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Stat label="فرق النقاط" value={`${res.diff > 0 ? "+" : ""}${res.diff}`} />
              <Stat label="نسبة التحسن" value={`${res.pct > 0 ? "+" : ""}${res.pct}٪`} />
            </div>

            <div className="card-glass p-6">
              <h3 className="font-bold text-lg">العناصر التي أضفتها</h3>
              {res.added.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {res.added.map((c) => <span key={c.key} className="rounded-full bg-success/20 px-3 py-1 text-sm text-success">✓ {c.label}</span>)}
                </div>
              ) : <p className="mt-2 text-muted-foreground">لم تُضف عناصر جديدة بعد.</p>}
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {CRITERIA.map((c) => {
                  const ok = res.b.met.some((m) => m.key === c.key);
                  return <div key={c.key} className={`flex justify-between rounded-lg px-3 py-2 text-sm ${ok ? "bg-success/10" : "bg-secondary/50 text-muted-foreground"}`}>
                    <span>{ok ? "✓" : "○"} {c.label}</span><span>{ok ? c.weight : 0}/{c.weight}</span></div>;
                })}
              </div>
            </div>

            <div className="card-glass p-6 text-center">
              <p className="text-xl font-bold">{encouragement(res.b.score, name)}</p>
              {res.b.missing[0] ? (
                <p className="mt-3 text-muted-foreground"><span className="font-semibold text-primary-glow">اقتراح للتحسين: </span>{res.b.missing[0].tip}</p>
              ) : <p className="mt-3 text-muted-foreground"><span className="font-semibold text-primary-glow">اقتراح: </span>جرّب البرومبت فعليًا على أداة ذكاء اصطناعي وقارن الإجابة بما توقعته.</p>}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              ملاحظة: التقييم يقيس اكتمال البرومبت وفق معايير محددة (المهمة، الجمهور، الأمثلة، التفاصيل، القيود، التنسيق، الأسلوب)، ولا يقيس دقة إجابة الذكاء الاصطناعي لأنه لا يختبر مخرجات فعلية.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

function PromptCard({ title, text, score, highlight }: { title: string; text: string; score: number; highlight?: boolean }) {
  return (
    <div className={`card-glass p-6 ${highlight ? "ring-2 ring-primary" : ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <span className="text-3xl font-extrabold text-gradient">{score}<span className="text-base text-muted-foreground">/100</span></span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-gradient-primary transition-all duration-1000" style={{ width: `${score}%` }} />
      </div>
      <p className="mt-4 whitespace-pre-wrap leading-8 text-muted-foreground">{text}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-glass p-6 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-4xl font-extrabold text-gradient" dir="ltr">{value}</p>
    </div>
  );
}
