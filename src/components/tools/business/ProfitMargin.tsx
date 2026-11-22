"use client";

import { useState } from "react";
import { Alert, Explain, NumberField, Panel, Stat, Toolbar, ResetButton, fmt, num } from "@/components/ui";
import { formatMoney, profitMargin } from "@/lib/calc/business";
import CurrencyField from "./Currency";

export default function ProfitMargin() {
  const [cur, setCur] = useState("$");
  const [cost, setCost] = useState("60");
  const [rev, setRev] = useState("100");
  const [qty, setQty] = useState("1");
  const c = num(cost), r = num(rev), q = num(qty) || 1;
  const valid = Number.isFinite(c) && Number.isFinite(r) && c >= 0 && r >= 0;
  const res = valid ? profitMargin(c, r) : null;

  return (
    <div className="space-y-4">
      <Panel>
        <div className="grid gap-4 sm:grid-cols-4">
          <CurrencyField value={cur} onChange={setCur} />
          <NumberField label="Cost per unit" value={cost} onChange={setCost} prefix={cur || undefined} min={0} />
          <NumberField label="Selling price per unit" value={rev} onChange={setRev} prefix={cur || undefined} min={0} />
          <NumberField label="Units sold" value={qty} onChange={setQty} min={1} step={1} />
        </div>
        <div className="mt-4"><Toolbar><ResetButton onClick={() => { setCost(""); setRev(""); setQty("1"); }} /></Toolbar></div>
        {!valid && (cost !== "" || rev !== "") && <div className="mt-4"><Alert kind="error">Enter cost and selling price as zero or positive numbers.</Alert></div>}
      </Panel>
      {res && (
        <Panel title="Result">
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Gross profit / unit" value={formatMoney(res.profit, cur)} />
              <Stat label="Profit margin" value={res.margin === null ? "—" : `${fmt(res.margin, 2)}%`} highlight />
              <Stat label="Markup" value={res.markup === null ? "—" : `${fmt(res.markup, 2)}%`} />
              <Stat label={`Total profit (${fmt(q, 0)} units)`} value={formatMoney(res.profit * q, cur)} sub={`Revenue ${formatMoney(r * q, cur)}`} />
            </div>
            {res.profit < 0 && <Alert kind="warn">You are selling below cost: each unit loses {formatMoney(-res.profit, cur)}.</Alert>}
            <Explain>
              <p>Gross profit = price − cost = {formatMoney(r, cur)} − {formatMoney(c, cur)} = {formatMoney(res.profit, cur)}</p>
              <p>Margin = profit ÷ price × 100 = {fmt(res.margin, 4)}%</p>
              <p>Markup = profit ÷ cost × 100 = {fmt(res.markup, 4)}%</p>
              <p>This is gross margin. It excludes overheads such as rent, salaries and advertising, which reduce net margin.</p>
            </Explain>
          </div>
        </Panel>
      )}
    </div>
  );
}
