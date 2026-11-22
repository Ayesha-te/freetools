"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Alert, Button, Explain, NumberField, Panel, Segmented, Stat, Toolbar, ResetButton, fmt, num } from "@/components/ui";
import { weightedAverage } from "@/lib/calc/student";

interface Sem { id: number; gpa: string; credits: string }
let id = 1;
const sem = (gpa = "", credits = "15"): Sem => ({ id: id++, gpa, credits });

export default function CgpaCalculator() {
  const [mode, setMode] = useState<"semesters" | "update">("semesters");
  const [maxScale, setMaxScale] = useState("4");
  const [sems, setSems] = useState<Sem[]>(() => [sem("3.4"), sem("3.7")]);
  const [prevCgpa, setPrevCgpa] = useState("");
  const [prevCredits, setPrevCredits] = useState("");

  const calc = useMemo(() => {
    const max = num(maxScale);
    if (!Number.isFinite(max) || max <= 0 || max > 100) return { error: "Maximum GPA must be a positive number (for example 4, 5 or 10)." };
    const items: { value: number; weight: number }[] = [];
    if (mode === "update") {
      if (prevCgpa === "" && prevCredits === "") return {};
      const g = num(prevCgpa), c = num(prevCredits);
      if (!Number.isFinite(g) || g < 0 || g > max) return { error: `Current CGPA must be between 0 and ${max}.` };
      if (!Number.isFinite(c) || c < 0) return { error: "Credits completed so far must be zero or more." };
      items.push({ value: g, weight: c });
    }
    for (const [i, s] of sems.entries()) {
      if (s.gpa === "" && s.credits === "") continue;
      const g = num(s.gpa), c = num(s.credits);
      if (!Number.isFinite(g) || g < 0 || g > max) return { error: `Semester ${i + 1}: GPA must be between 0 and ${max}.` };
      if (!Number.isFinite(c) || c <= 0 || c > 200) return { error: `Semester ${i + 1}: credits must be greater than 0.` };
      items.push({ value: g, weight: c });
    }
    const r = weightedAverage(items);
    return r ? { r, items, max } : {};
  }, [mode, maxScale, sems, prevCgpa, prevCredits]);

  const upd = (i: number, k: "gpa" | "credits", v: string) => setSems((s) => s.map((x) => (x.id === i ? { ...x, [k]: v } : x)));

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <Segmented label="Calculation type" value={mode} onChange={setMode} options={[{ value: "semesters", label: "From all semesters" }, { value: "update", label: "Update existing CGPA" }]} />
          <NumberField label="Maximum GPA on your scale" value={maxScale} onChange={setMaxScale} className="max-w-xs" hint="Used only for validation: 4, 4.3, 5 or 10 are common." />
          {mode === "update" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Current CGPA" value={prevCgpa} onChange={setPrevCgpa} placeholder="e.g. 3.25" />
              <NumberField label="Credits completed so far" value={prevCredits} onChange={setPrevCredits} placeholder="e.g. 60" />
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-medium text-ink">{mode === "update" ? "New semester(s)" : "Semesters"}</p>
            {sems.map((s, i) => (
              <div key={s.id} className="flex flex-wrap items-end gap-2">
                <span className="mb-2.5 w-24 text-sm text-muted">Semester {i + 1}</span>
                <NumberField label="GPA" value={s.gpa} onChange={(v) => upd(s.id, "gpa", v)} className="w-28" />
                <NumberField label="Credits" value={s.credits} onChange={(v) => upd(s.id, "credits", v)} className="w-28" />
                <button type="button" onClick={() => setSems((x) => x.filter((y) => y.id !== s.id))} aria-label={`Remove semester ${i + 1}`} className="mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md text-muted hover:text-danger">
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
          </div>
          <Toolbar>
            <Button variant="secondary" onClick={() => setSems((s) => [...s, sem()])}><Plus className="h-4 w-4" aria-hidden /> Add semester</Button>
            <ResetButton onClick={() => { setSems([sem(), sem()]); setPrevCgpa(""); setPrevCredits(""); }} />
          </Toolbar>
          {calc.error && <Alert kind="error">{calc.error}</Alert>}
        </div>
      </Panel>
      <Panel title="Cumulative result">
        <div aria-live="polite" className="space-y-4">
          {calc.r ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="CGPA" value={calc.r.average.toFixed(2)} sub={`out of ${calc.max}`} highlight />
                <Stat label="Total credits" value={fmt(calc.r.totalWeight)} />
                <Stat label="Percent of max" value={`${fmt((calc.r.average / calc.max!) * 100, 1)}%`} sub="Not an official conversion" />
              </div>
              <Explain>
                <p>CGPA = Σ(semester GPA × semester credits) ÷ Σ credits.</p>
                <p>{calc.items!.map((it) => `${it.value} × ${it.weight}`).join(" + ")} = {fmt(calc.r.totalWeighted, 3)}</p>
                <p>{fmt(calc.r.totalWeighted, 3)} ÷ {fmt(calc.r.totalWeight)} = <strong>{calc.r.average.toFixed(4)}</strong></p>
                <p>Averaging semester GPAs without weighting by credits gives a different (incorrect) answer whenever semesters have different credit loads.</p>
              </Explain>
            </>
          ) : (
            <p className="text-sm text-muted">Enter GPA and credits for at least one semester.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}
