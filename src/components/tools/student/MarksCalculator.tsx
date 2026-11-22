"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Alert, Button, Explain, NumberField, Panel, Stat, Toolbar, ResetButton, fmt, num } from "@/components/ui";
import { marksNeeded, marksSummary } from "@/lib/calc/student";

interface Row { id: number; name: string; obtained: string; total: string }
let id = 1;
const row = (name = "", obtained = "", total = "100"): Row => ({ id: id++, name, obtained, total });

export default function MarksCalculator() {
  const [rows, setRows] = useState<Row[]>(() => [row("English", "78"), row("Mathematics", "91"), row("Science", "84")]);
  const [target, setTarget] = useState("85");
  const [remaining, setRemaining] = useState("");

  const calc = useMemo(() => {
    const filled = rows.filter((r) => r.obtained !== "");
    if (!filled.length) return {};
    try {
      const s = marksSummary(filled.map((r) => ({ obtained: num(r.obtained), total: num(r.total) })));
      return { s };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [rows]);

  const upd = (i: number, k: keyof Row, v: string) => setRows((rs) => rs.map((r) => (r.id === i ? { ...r, [k]: v } : r)));
  const t = num(target), rem = num(remaining);
  const grand = calc.s ? calc.s.total + (Number.isFinite(rem) && rem > 0 ? rem : 0) : 0;
  const need = calc.s && Number.isFinite(t) ? marksNeeded(t, calc.s.obtained, grand) : null;

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="text-left text-muted">
                  <th className="pb-2 font-medium">Subject</th>
                  <th className="w-20 pb-2 font-medium">Obtained</th>
                  <th className="w-20 pb-2 font-medium">Max</th>
                  <th className="w-12 pb-2 font-medium">%</th>
                  <th className="w-9"><span className="sr-only">Remove</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const p = num(r.obtained) / num(r.total) * 100;
                  return (
                    <tr key={r.id}>
                      <td className="py-1 pr-2"><input aria-label={`Subject ${i + 1} name`} value={r.name} placeholder={`Subject ${i + 1}`} onChange={(e) => upd(r.id, "name", e.target.value)} className="w-full min-w-0 rounded-lg border border-border-strong bg-surface px-2 py-2 text-ink" /></td>
                      <td className="py-1 pr-2"><input aria-label={`Subject ${i + 1} marks obtained`} type="number" min={0} value={r.obtained} onChange={(e) => upd(r.id, "obtained", e.target.value)} className="w-full min-w-0 rounded-lg border border-border-strong bg-surface px-2 py-2 text-ink" /></td>
                      <td className="py-1 pr-2"><input aria-label={`Subject ${i + 1} maximum marks`} type="number" min={1} value={r.total} onChange={(e) => upd(r.id, "total", e.target.value)} className="w-full min-w-0 rounded-lg border border-border-strong bg-surface px-2 py-2 text-ink" /></td>
                      <td className="py-1 pr-2 tabular-nums text-ink-2">{Number.isFinite(p) ? fmt(p, 1) : "—"}</td>
                      <td className="w-10"><button type="button" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} aria-label={`Remove subject ${i + 1}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-danger"><Trash2 className="h-4 w-4" aria-hidden /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Toolbar>
            <Button variant="secondary" onClick={() => setRows((r) => [...r, row()])}><Plus className="h-4 w-4" aria-hidden /> Add subject</Button>
            <ResetButton onClick={() => setRows([row(), row(), row()])} />
          </Toolbar>
          {calc.error && <Alert kind="error">{calc.error}</Alert>}
        </div>
      </Panel>
      <Panel title="Totals">
        <div aria-live="polite" className="space-y-4">
          {calc.s ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="Total obtained" value={fmt(calc.s.obtained)} sub={`out of ${fmt(calc.s.total)}`} />
                <Stat label="Overall percentage" value={`${fmt(calc.s.percentage, 2)}%`} highlight />
                <Stat label="Subjects counted" value={rows.filter((r) => r.obtained !== "").length} />
              </div>
              <Explain>
                <p>Percentage = (total obtained ÷ total maximum) × 100 = ({fmt(calc.s.obtained)} ÷ {fmt(calc.s.total)}) × 100 = {fmt(calc.s.percentage, 4)}%.</p>
                <p>This is an aggregate of all marks, so a 50-mark subject counts half as much as a 100-mark subject. Some boards use “best of five” or exclude subjects — remove those rows if so.</p>
              </Explain>
            </>
          ) : (
            <p className="text-sm text-muted">Enter marks for at least one subject.</p>
          )}
        </div>
      </Panel>
      <Panel title="Marks needed for a target">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Target overall percentage" value={target} onChange={setTarget} suffix="%" />
          <NumberField label="Maximum marks still to come (optional)" value={remaining} onChange={setRemaining} placeholder="e.g. 100" hint="Marks available in exams you haven't taken yet." />
        </div>
        <div className="mt-4" aria-live="polite">
          {calc.s && need !== null && Number.isFinite(rem) && rem > 0 ? (
            need > rem ? (
              <Alert kind="warn">You would need {fmt(need)} more marks, but only {fmt(rem)} are available — the target is not reachable.</Alert>
            ) : (
              <Alert kind="info">You need at least <strong>{fmt(Math.ceil(need))}</strong> of the remaining {fmt(rem)} marks ({fmt((need / rem) * 100, 1)}%) to reach {fmt(t)}% overall.</Alert>
            )
          ) : calc.s && Number.isFinite(t) ? (
            <p className="text-sm text-muted">{calc.s.percentage >= t ? `You are already at or above ${fmt(t)}%.` : "Enter the marks still to come to see what you need."}</p>
          ) : null}
        </div>
      </Panel>
    </div>
  );
}
