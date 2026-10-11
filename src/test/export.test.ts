import { describe, it, expect } from "vitest";
import { boardToCsv } from "@/lib/export";
import type { Entry } from "@/lib/leaderboard";

const rows: Entry[] = [
  { id: 1, name: "سارة", prompt: "ص", score: 100, helped: false, created_at: "2026-10-11T11:15:47.000Z" },
  { id: 2, name: 'خالد, "أبو', prompt: "ص", score: 75, helped: false, created_at: "2026-10-11T11:20:00.000Z" },
  { id: 3, name: "=1+1", prompt: "ص", score: 0, helped: false, created_at: "2026-10-11T11:25:00.000Z" },
];

const csv = boardToCsv(rows);
const body = csv.replace(/^﻿/, "");
const rawLine = (i: number) => body.split("\r\n")[i];
const fields = (i: number) => rawLine(i).split(",");

describe("CSV export", () => {
  it("starts with a BOM and an Arabic header line", () => {
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(body.split("\r\n")[0]).toBe("الترتيب,الاسم,الدرجة من 100,الوقت");
  });
  it("ranks students by score and keeps the score as a bare number", () => {
    expect(fields(1).slice(0, 3)).toEqual(["1", "سارة", "100"]);
    expect(fields(2)[0]).toBe("2");
    expect(fields(3)[2]).toBe("0");
  });
  it("writes the time as YYYY-MM-DD HH:MM", () => {
    expect(fields(1)[3]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });
  it("quotes a name holding a comma or a quote", () => {
    expect(rawLine(2).startsWith('2,"خالد, ""أبو",75,')).toBe(true);
  });
  it("never lets a name open as a formula", () => {
    expect(fields(3)[1]).toBe(" =1+1");
  });
});
