import { describe, it, expect } from "vitest";
import { boardToCsv } from "@/lib/export";
import type { Entry } from "@/lib/leaderboard";

const rows: Entry[] = [
  { id: 1, name: "سارة", prompt: "ص", score: 100, helped: false, created_at: "2026-10-11T11:15:47.000Z" },
  { id: 2, name: 'خالد, "أبو', prompt: "ص", score: 75, helped: false, created_at: "2026-10-11T11:20:00.000Z" },
  { id: 3, name: "=1+1", prompt: "ص", score: 0, helped: false, created_at: "2026-10-11T11:25:00.000Z" },
];

describe("CSV export", () => {
  it("starts with a BOM and an Arabic header line", () => {
    const csv = boardToCsv(rows);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv.split("\r\n")[0]).toBe("الترتيب,الاسم,الدرجة من 100,الوقت");
  });
  it("numbers the students by rank and keeps the score as a bare number", () => {
    expect(csv_line(boardToCsv(rows), 1)).toBe("1,سارة,100,2026-10-11 11:15");
  });
  it("quotes a name holding a comma or a quote", () => {
    expect(csv_line(boardToCsv(rows), 2)).toBe('2,"خالد, ""أبو",75,2026-10-11 11:20');
  });
  it("never lets a name open as a formula", () => {
    expect(csv_line(boardToCsv(rows), 3)).toBe("3, =1+1,0,2026-10-11 11:25");
  });
});

function csv_line(csv: string, index: number): string {
  return csv.replace(/^\uFEFF/, "").split("\r\n")[index];
}
