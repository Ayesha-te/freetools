"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Alert, Button, Explain, NumberField, Panel, Stat, Toolbar, ResetButton, fmt, num } from "@/components/ui";
import { gradeProjection } from "@/lib/calc/student";

interface Row { id: number; name: string; score: string; weight: string }
let id = 1;
const row = (name = "", score = "", weight = ""): Row => ({ id: id++, name, score, weight });

export default function GradeCalculator() {
  const [rows, setRows] = useState<Row[]>(() => [row("Assignments", "88", "20"), row("Midterm", "76", "30")]);
  const [finalWeight, setFinalWeight] = useState("50");
  const [target, setTarget] = useState("80");

  const calc = useMemo(() => {
    const items = [];
    for (const [i, r] of rows.entries()) {
      if (r.score === "" && r.weight === "") continue;
      const s = num(r.score), w = num(r.weight);
      if (!Number.isFinite(s) || s < 0 || s > 150) return { error: `Row ${i + 1}: score must be a percentage between 0 and 150.` };
      if (!Number.isFinite(w) || w <= 0 || w > 100) return { error: `Row ${i + 1}: weight must be between 0 and 100%.` };
      items.push({ score: s, weight: w });
    }
    const fw = finalWeight === "" ? 0 : num(finalWeight);
    if (!Number.isFinite(fw) || fw < 0 || fw > 100) return { error: "Final exam weight must be between 0 and 100%." };
    const t = num(target);
    const g = gradeProjection(items, Number.isFinite(t) ? t : 0, fw);
    if (g.totalWeight > 100.0001) return { error: `Weights add up to ${fmt(g.totalWeight)}%. They should total 100% or less.`, g };
    return { g, t };
  }, [rows, finalWeight, target]);

  const upd = (i: number, k: keyof Row, v: string) => setRows((rs) => rs.map((r) => (r.id === i ? { ...r, [k]: v } : r)));

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <p className="text-sm text-ink-2">Enter each completed piece of work as a percentage score and its weight in the course.</p>
          {rows.map((r, i) => (
            <div key={r.id} className="grid grid-cols-[1fr_auto] items-end gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]">
              <label className="col-span-2 flex flex-col gap-1.5 text-sm font-medium text-ink sm:col-span-1">
                Assessment
                <input value={r.name} placeholder={`Assessment ${i + 1}`} onChange={(e) => upd(r.id, "name", e.target.value)} className="min-h-10 rounded-lg border border-border-strong bg-surface px-3 py-2 font-normal text-ink" />
              </label>
              <NumberField label="Score" value={r.score} onChange={(v) => upd(r.id, "score", v)} suffix="%" />
              <NumberField label="Weight" value={r.weight} onChange={(v) => upd(r.id, "weight", v)} suffix="%" />
              <button type="button" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} aria-label={`Remove assessment ${i + 1}`} className="mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md text-muted hover:text-danger"><Trash2 className="h-4 w-4" aria-hidden /></button>
            </div>
          ))}
          <Toolbar>
            <Button variant="secondary" onClick={() => setRows((r) => [...r, row()])}><Plus className="h-4 w-4" aria-hidden /> Add assessment</Button>
            <ResetButton onClick={() => { setRows([row(), row()]); setFinalWeight("50"); setTarget("80"); }} />
          </Toolbar>
          <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <NumberField label="Remaining (final exam) weight" value={finalWeight} onChange={setFinalWeight} suffix="%" hint="Weight of work not yet graded." />
            <NumberField label="Target course grade" value={target} onChange={setTarget} suffix="%" />
          </div>
          {calc.error && <Alert kind="error">{calc.error}</Alert>}
        </div>
      </Panel>
      {calc.g && !calc.error && (
        <Panel title="Result">
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Current grade" value={calc.g.current === null ? "—" : `${fmt(calc.g.current, 2)}%`} sub={`Based on ${fmt(calc.g.completedWeight)}% of the course`} highlight />
              <Stat label="Points earned" value={`${fmt(calc.g.earned, 2)}%`} sub="of the total course" />
              <Stat label="Needed on final" value={calc.g.needed === null ? "—" : `${fmt(calc.g.needed, 2)}%`} sub={`for ${fmt(calc.t)}% overall`} />
            </div>
            {calc.g.needed !== null && calc.g.needed > 100 && <Alert kind="warn">You would need more than 100% on the remaining work, so {fmt(calc.t)}% is not reachable unless extra credit is available.</Alert>}
            {calc.g.needed !== null && calc.g.needed <= 0 && <Alert kind="success">You have already secured {fmt(calc.t)}% even with 0% on the remaining work.</Alert>}
            <Explain>
              <p>Points earned = Σ(score × weight ÷ 100) = {fmt(calc.g.earned, 4)}.</p>
              <p>Current grade = points earned ÷ completed weight × 100 = {fmt(calc.g.current, 4)}%.</p>
              <p>Needed on final = (target − points earned) ÷ final weight × 100 = ({fmt(calc.t)} − {fmt(calc.g.earned, 4)}) ÷ {fmt(num(finalWeight))} × 100 = {fmt(calc.g.needed, 4)}%.</p>
            </Explain>
          </div>
        </Panel>
      )}
    </div>
  );
}
