"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Alert, Button, Explain, Panel, Select, Stat, Toolbar, ResetButton, fmt, num } from "@/components/ui";
import { gradeScales, weightedAverage, type GradeScaleEntry } from "@/lib/calc/student";

interface Row { id: number; name: string; grade: string; credits: string }
let nextId = 1;
const newRow = (grade = ""): Row => ({ id: nextId++, name: "", grade, credits: "3" });

export default function GpaCalculator() {
  const [scaleId, setScaleId] = useState("us4");
  const [custom, setCustom] = useState<GradeScaleEntry[] | null>(null);
  const [rows, setRows] = useState<Row[]>(() => [newRow("A"), newRow("B"), newRow("A")]);
  const scale = custom ?? gradeScales.find((s) => s.id === scaleId)!.entries;

  const { result, error } = useMemo(() => {
    const filled = rows.filter((r) => r.grade && r.credits.trim() !== "");
    if (!filled.length) return { result: null, error: "" };
    for (const r of filled) {
      const c = num(r.credits);
      if (!Number.isFinite(c) || c < 0 || c > 50) return { result: null, error: `Credits must be a number between 0 and 50 (check “${r.name || "unnamed course"}”).` };
      if (!scale.find((e) => e.grade === r.grade)) return { result: null, error: `Grade “${r.grade}” is not on the selected scale. Choose a grade again.` };
    }
    try {
      const items = filled.map((r) => ({ value: scale.find((e) => e.grade === r.grade)!.points, weight: num(r.credits) }));
      return { result: weightedAverage(items), error: "" };
    } catch (e) {
      return { result: null, error: (e as Error).message };
    }
  }, [rows, scale]);

  const upd = (id: number, k: keyof Row, v: string) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)));
  const maxPts = Math.max(...scale.map((e) => e.points));

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <Select
            label="Grading scale"
            value={custom ? "custom" : scaleId}
            onChange={(e) => {
              if (e.target.value === "custom") setCustom(scale.map((x) => ({ ...x })));
              else { setCustom(null); setScaleId(e.target.value); }
            }}
            className="max-w-md"
            hint="Check your institution's handbook — grade point values differ between schools."
          >
            {gradeScales.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            <option value="custom">Custom (edit points)</option>
          </Select>
          {custom && (
            <fieldset className="rounded-lg border border-border p-3">
              <legend className="px-1 text-sm font-medium text-ink">Grade points</legend>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {custom.map((e, i) => (
                  <label key={i} className="flex items-center gap-1 text-sm">
                    <span className="w-8 font-medium text-ink">{e.grade}</span>
                    <input type="number" step="0.1" value={e.points} aria-label={`Points for ${e.grade}`} onChange={(ev) => setCustom((c) => c!.map((x, k) => (k === i ? { ...x, points: Number(ev.target.value) || 0 } : x)))} className="w-full min-w-0 rounded border border-border-strong bg-surface px-2 py-1 text-ink" />
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="text-left text-muted">
                  <th className="pb-2 font-medium">Course</th>
                  <th className="w-28 pb-2 font-medium">Grade</th>
                  <th className="w-20 pb-2 font-medium">Credits</th>
                  <th className="w-10 pb-2"><span className="sr-only">Remove</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id}>
                    <td className="py-1 pr-2"><input aria-label={`Course ${i + 1} name`} value={r.name} placeholder={`Course ${i + 1}`} onChange={(e) => upd(r.id, "name", e.target.value)} className="w-full min-w-0 rounded-lg border border-border-strong bg-surface px-2 py-2 text-ink" /></td>
                    <td className="py-1 pr-2">
                      <select aria-label={`Course ${i + 1} grade`} value={r.grade} onChange={(e) => upd(r.id, "grade", e.target.value)} className="w-full min-w-0 rounded-lg border border-border-strong bg-surface px-1 py-2 text-ink">
                        <option value="">—</option>
                        {scale.map((e) => <option key={e.grade} value={e.grade}>{e.grade} ({e.points})</option>)}
                      </select>
                    </td>
                    <td className="w-20 py-1 pr-2"><input aria-label={`Course ${i + 1} credits`} type="number" min={0} step="0.5" value={r.credits} onChange={(e) => upd(r.id, "credits", e.target.value)} className="w-full min-w-0 rounded-lg border border-border-strong bg-surface px-2 py-2 text-ink" /></td>
                    <td className="w-10 py-1"><button type="button" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} aria-label={`Remove course ${i + 1}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-danger"><Trash2 className="h-4 w-4" aria-hidden /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Toolbar>
            <Button variant="secondary" onClick={() => setRows((r) => [...r, newRow()])}><Plus className="h-4 w-4" aria-hidden /> Add course</Button>
            <ResetButton onClick={() => setRows([newRow(), newRow(), newRow()])} />
          </Toolbar>
          {error && <Alert kind="error">{error}</Alert>}
        </div>
      </Panel>
      <Panel title="Your GPA">
        <div className="space-y-4" aria-live="polite">
          {result ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="Semester GPA" value={result.average.toFixed(2)} sub={`out of ${maxPts.toFixed(1)}`} highlight />
                <Stat label="Total credits" value={fmt(result.totalWeight)} />
                <Stat label="Quality points" value={fmt(result.totalWeighted)} />
              </div>
              <Explain>
                <p>GPA = total quality points ÷ total credits.</p>
                <p>Quality points for each course = grade points × credits.</p>
                <p>{fmt(result.totalWeighted)} ÷ {fmt(result.totalWeight)} = <strong>{result.average.toFixed(4)}</strong>, shown rounded to 2 decimals.</p>
                <p>Courses with no grade selected are ignored. Pass/fail courses usually do not count toward GPA, so leave them out.</p>
              </Explain>
            </>
          ) : (
            <p className="text-sm text-muted">Choose a grade and credits for at least one course to see your GPA.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}
