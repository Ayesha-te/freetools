"use client";

import { useState } from "react";
import { NumberField, Panel, Stat, Explain, fmt, num } from "@/components/ui";
import { percentChange, percentOf, whatPercent } from "@/lib/calc/student";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel>
      <h2 className="mb-3 text-base font-semibold text-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
    </Panel>
  );
}

export default function PercentageCalculator() {
  const [a1, setA1] = useState("15");
  const [b1, setB1] = useState("200");
  const [a2, setA2] = useState("45");
  const [b2, setB2] = useState("60");
  const [a3, setA3] = useState("80");
  const [b3, setB3] = useState("100");
  const [a4, setA4] = useState("120");
  const [b4, setB4] = useState("20");

  const r1 = percentOf(num(a1), num(b1));
  const r2 = whatPercent(num(a2), num(b2));
  const r3 = percentChange(num(a3), num(b3));
  const n4 = num(a4), p4 = num(b4);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="What is X% of Y?">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Percentage" value={a1} onChange={setA1} suffix="%" />
          <NumberField label="Of number" value={b1} onChange={setB1} />
        </div>
        <div aria-live="polite"><Stat label="Result" value={fmt(r1, 4)} highlight /></div>
        <Explain><p>(X ÷ 100) × Y = ({a1 || "X"} ÷ 100) × {b1 || "Y"} = {fmt(r1, 6)}</p></Explain>
      </Card>
      <Card title="X is what percent of Y?">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Part (X)" value={a2} onChange={setA2} />
          <NumberField label="Whole (Y)" value={b2} onChange={setB2} />
        </div>
        <div aria-live="polite"><Stat label="Result" value={r2 === null ? "Whole cannot be 0" : `${fmt(r2, 4)}%`} highlight /></div>
        <Explain><p>(X ÷ Y) × 100 = ({a2 || "X"} ÷ {b2 || "Y"}) × 100 = {fmt(r2, 6)}%</p></Explain>
      </Card>
      <Card title="Percentage increase or decrease">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="From (old value)" value={a3} onChange={setA3} />
          <NumberField label="To (new value)" value={b3} onChange={setB3} />
        </div>
        <div aria-live="polite">
          <Stat label={r3 !== null && r3 < 0 ? "Decrease" : "Increase"} value={r3 === null ? "Old value cannot be 0" : `${fmt(Math.abs(r3), 4)}%`} sub={Number.isFinite(num(a3)) && Number.isFinite(num(b3)) ? `Difference: ${fmt(num(b3) - num(a3), 4)}` : undefined} highlight />
        </div>
        <Explain><p>((New − Old) ÷ |Old|) × 100 = (({b3} − {a3}) ÷ {Math.abs(num(a3)) || "Old"}) × 100 = {fmt(r3, 6)}%</p></Explain>
      </Card>
      <Card title="Add or subtract a percentage">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Number" value={a4} onChange={setA4} />
          <NumberField label="Percentage" value={b4} onChange={setB4} suffix="%" />
        </div>
        <div className="grid grid-cols-2 gap-3" aria-live="polite">
          <Stat label={`+${fmt(p4)}%`} value={fmt(n4 * (1 + p4 / 100), 4)} highlight />
          <Stat label={`−${fmt(p4)}%`} value={fmt(n4 * (1 - p4 / 100), 4)} />
        </div>
        <Explain><p>Number × (1 ± P ÷ 100). Note that adding 20% and then subtracting 20% does not return the original number.</p></Explain>
      </Card>
    </div>
  );
}
