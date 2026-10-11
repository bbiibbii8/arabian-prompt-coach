import { describe, it, expect } from "vitest";
import { boardToCsv } from "@/lib/export";
import type { Entry } from "@/lib/leaderboard";

const rows: Entry[] = [
  { id: 1, name: "سارة", prompt: "ص", score: 100, helped: false, created_at: "2026-10-11T11:15:47.000Z" },
  { id: 2, name: 'خالد, "أبو', prompt: "ص", score: 75, helped: false, created_at: "2026-10-11T11:20:00.000Z" },
  { id: 3, name: "=1+1", prompt: "ص", score: 0, helped: false, created_at: "2026-10-11T11:25:00.000Z" },
];

const line = (csv: string, index: number) => csv.replace(/^\uFEFF/, "").split("\r\n")[index].split(",");

describe("CSV export", () => {
  it("starts with a BOM and an Arabic header line", () => {
    const csv = boardToCsv(rows);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv.replace(/^\uFEFF/, "").split("\r\n")[0]).toBe("الترتيب,الاسم,الدرجة من 100,الوقت");
  });
  it("ranks students by score and keeps the score as a bare number", () => {
    const csv = boardToCsv(rows);
    expect(line(csv, 1).slice(0, 3)).toEqual(["1", "سارة", "100"]);
    expect(line(csv, 2).slice(0, 1)).toEqual(["2"]);
    expect(line(csv, 3).slice(-1)).toEqual(["0"]);
  });
  it("quotes a name holding a comma or a quote", () => {
    expect(csv_line(boardToCsv(rows), 2)).toBe('2,"خالد, ""أبو",75,');
  });
  it("never lets a name open as a formula", () => {
    expect(line(csv, 3)[1]).toBe(" =1+1");
  });
});

function csv_line(csv: string, index: number): string {
  return csv.replace(/^\uFEFF/, "").split("\r\n")[index];
}
