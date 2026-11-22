"use client";

import { useState } from "react";
import { Alert, Explain, NumberField, Panel, Stat, Toolbar, ResetButton, fmt, num } from "@/components/ui";
import { breakEven, formatMoney } from "@/lib/calc/business";
import CurrencyField from "./Currency";

export default function BreakEven() {
  const [cur, setCur] = useState("$");
  const [fixed, setFixed] = useState("5000");
  const [price, setPrice] = useState("25");
  const [variable, setVariable] = useState("10");
  const [profit, setProfit] = useState("");
  const f = num(fixed), p = num(price), v = num(variable), tp = profit === "" ? 0 : num(profit);
  const valid = [f, p, v, tp].every((x) => Number.isFinite(x) && x >= 0);
  const res = valid ? breakEven(f, p, v, tp) : null;

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <CurrencyField value={cur} onChange={setCur} />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Fixed costs (per period)" value={fixed} onChange={setFixed} prefix={cur || undefined} hint="Rent, salaries, software — costs that don't change with sales volume." />
            <NumberField label="Selling price per unit" value={price} onChange={setPrice} prefix={cur || undefined} />
            <NumberField label="Variable cost per unit" value={variable} onChange={setVariable} prefix={cur || undefined} hint="Materials, packaging, per-sale fees." />
            <NumberField label="Target profit (optional)" value={profit} onChange={setProfit} prefix={cur || undefined} placeholder="0" />
          </div>
          <Toolbar><ResetButton onClick={() => { setFixed(""); setPrice(""); setVariable(""); setProfit(""); }} /></Toolbar>
          {!valid && <Alert kind="error">All values must be zero or positive numbers.</Alert>}
          {valid && !res && <Alert kind="error">The selling price must be higher than the variable cost per unit, otherwise every sale loses money and you can never break even.</Alert>}
        </div>
      </Panel>
      {res && (
        <Panel title={tp > 0 ? "Units needed for your target profit" : "Break-even point"}>
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Units to sell" value={fmt(res.unitsRounded, 0)} sub={`Exact: ${fmt(res.units, 2)}`} highlight />
              <Stat label="Revenue needed" value={formatMoney(res.revenue, cur)} />
              <Stat label="Contribution / unit" value={formatMoney(res.contribution, cur)} />
              <Stat label="Contribution ratio" value={`${fmt(res.contributionRatio, 2)}%`} />
            </div>
            <Explain>
              <p>Contribution margin = price − variable cost = {fmt(p, 4)} − {fmt(v, 4)} = {fmt(res.contribution, 4)}</p>
              <p>Units = (fixed costs + target profit) ÷ contribution = ({fmt(f, 2)} + {fmt(tp, 2)}) ÷ {fmt(res.contribution, 4)} = {fmt(res.units, 4)}, rounded up to {fmt(res.unitsRounded, 0)} whole units.</p>
              <p>Revenue = units × price. This model assumes a constant price and variable cost at every volume.</p>
            </Explain>
          </div>
        </Panel>
      )}
    </div>
  );
}
