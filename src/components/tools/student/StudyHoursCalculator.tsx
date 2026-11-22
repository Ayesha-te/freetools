"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Alert, Button, Explain, NumberField, Panel, Stat, Toolbar, ResetButton, fmt, num } from "@/components/ui";
import { studyPlan, difficultyFactor } from "@/lib/calc/student";

interface Row { id: number; name: string; credits: string; difficulty: "1" | "2" | "3" }
let id = 1;
const row = (name = "", credits = "3", difficulty: Row["difficulty"] = "2"): Row => ({ id: id++, name, credits, difficulty });
const hm = (h: number) => {
  const m = Math.round(h * 60);
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
};

export default function StudyHoursCalculator() {
  const [rows, setRows] = useState<Row[]>(() => [row("Calculus", "4", "3"), row("History", "3", "2"), row("Art", "2", "1")]);
  const [ratio, setRatio] = useState("2");
  const [days, setDays] = useState("5");

  const calc = useMemo(() => {
    const r = num(ratio), d = Math.round(num(days));
    if (!Number.isFinite(r) || r < 0 || r > 10) return { error: "Hours per credit should be between 0 and 10." };
    if (!Number.isFinite(d) || d < 1 || d > 7) return { error: "Study days per week must be between 1 and 7." };
    const subjects = [];
    for (const [i, x] of rows.entries()) {
      const c = num(x.credits);
      if (!Number.isFinite(c) || c < 0 || c > 30) return { error: `Row ${i + 1}: credits must be between 0 and 30.` };
      subjects.push({ name: x.name || `Subject ${i + 1}`, credits: c, difficulty: Number(x.difficulty) as 1 | 2 | 3 });
    }
    if (!subjects.length) return {};
    return { p: studyPlan(subjects, r, d), d };
  }, [rows, ratio, days]);

  const upd = (i: number, k: keyof Row, v: string) => setRows((rs) => rs.map((r) => (r.id === i ? { ...r, [k]: v } : r)));

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Study hours per credit per week" value={ratio} onChange={setRatio} hint="A common guideline is 2–3 hours outside class per credit hour." />
            <NumberField label="Study days per week" value={days} onChange={setDays} min={1} max={7} step={1} />
          </div>
          {rows.map((r, i) => (
            <div key={r.id} className="grid grid-cols-[1fr_auto] items-end gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]">
              <label className="col-span-2 flex flex-col gap-1.5 text-sm font-medium text-ink sm:col-span-1">
                Subject
                <input value={r.name} placeholder={`Subject ${i + 1}`} onChange={(e) => upd(r.id, "name", e.target.value)} className="min-h-10 rounded-lg border border-border-strong bg-surface px-3 py-2 font-normal text-ink" />
              </label>
              <NumberField label="Credits" value={r.credits} onChange={(v) => upd(r.id, "credits", v)} />
              <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
                Difficulty
                <select value={r.difficulty} onChange={(e) => upd(r.id, "difficulty", e.target.value)} className="min-h-10 rounded-lg border border-border-strong bg-surface px-2 py-2 font-normal text-ink">
                  <option value="1">Easy (×{difficultyFactor[1]})</option>
                  <option value="2">Medium (×{difficultyFactor[2]})</option>
                  <option value="3">Hard (×{difficultyFactor[3]})</option>
                </select>
              </label>
              <button type="button" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} aria-label={`Remove subject ${i + 1}`} className="mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md text-muted hover:text-danger"><Trash2 className="h-4 w-4" aria-hidden /></button>
            </div>
          ))}
          <Toolbar>
            <Button variant="secondary" onClick={() => setRows((r) => [...r, row()])}><Plus className="h-4 w-4" aria-hidden /> Add subject</Button>
            <ResetButton onClick={() => { setRows([row()]); setRatio("2"); setDays("5"); }} />
          </Toolbar>
          {calc.error && <Alert kind="error">{calc.error}</Alert>}
        </div>
      </Panel>
      {calc.p && (
        <Panel title="Your weekly study plan">
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Total per week" value={hm(calc.p.totalWeekly)} highlight />
              <Stat label="Average per study day" value={hm(calc.p.perDay)} sub={`over ${calc.d} days`} />
            </div>
            {calc.p.perDay > 8 && <Alert kind="warn">More than 8 hours a day is hard to sustain. Consider more study days or a lower hours-per-credit ratio.</Alert>}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] text-sm">
                <thead><tr className="border-b border-border text-left text-muted"><th className="py-2 font-medium">Subject</th><th className="py-2 font-medium">Per week</th><th className="py-2 font-medium">Per study day</th></tr></thead>
                <tbody>
                  {calc.p.rows.map((r, i) => (
                    <tr key={i} className="border-b border-border last:border-0"><td className="py-2 text-ink">{r.name}</td><td className="py-2 tabular-nums">{hm(r.weekly)}</td><td className="py-2 tabular-nums">{hm(r.perDay)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Explain>
              <p>Weekly hours per subject = credits × hours per credit × difficulty factor.</p>
              <p>Difficulty factors: easy ×0.75, medium ×1, hard ×1.5. Per-day time = weekly hours ÷ study days.</p>
              <p>Total: {fmt(calc.p.totalWeekly, 2)} hours ÷ {calc.d} days = {fmt(calc.p.perDay, 2)} hours per day.</p>
            </Explain>
          </div>
        </Panel>
      )}
    </div>
  );
}
