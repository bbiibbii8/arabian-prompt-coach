import type { Entry } from "@/lib/leaderboard";

const HEADER = ["الترتيب", "الاسم", "الدرجة من 100", "الوقت"];

function time(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function cell(value: string | number): string {
  if (typeof value === "number") return String(value);
  let s = value.replace(/\s+/g, " ").trim();
  // Keep a name like "=1+1" from becoming a formula when the file is opened.
  if (/^[=+\-@\t]/.test(s)) s = " " + s;
  return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// UTF-8 BOM up front so Arabic names show correctly in Excel.
export function boardToCsv(entries: Entry[]): string {
  const rows = [HEADER, ...entries.map((e, i) => [i + 1, e.name, e.score, time(e.created_at)])];
  return "\uFEFF" + rows.map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}

export function downloadCsv(filename: string, csv: string): void {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
