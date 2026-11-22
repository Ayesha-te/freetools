"use client";

import { useState } from "react";
import { Alert, Explain, NumberField, Panel, Stat, Toolbar, ResetButton, fmt, num } from "@/components/ui";
import { formatMoney, productPrice } from "@/lib/calc/business";
import CurrencyField from "./Currency";

export default function ProductPricing() {
  const [cur, setCur] = useState("$");
  const [v, setV] = useState({ unitCost: "12", extraCosts: "1.5", feePercent: "8", feeFixed: "0.30", targetMargin: "35", taxPercent: "0" });
  const set = (k: keyof typeof v) => (x: string) => setV((s) => ({ ...s, [k]: x }));
  const n = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, x === "" ? 0 : num(x)])) as Record<keyof typeof v, number>;
  const invalid = Object.values(n).some((x) => !Number.isFinite(x) || x < 0);
  const res = invalid ? null : productPrice(n);

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <CurrencyField value={cur} onChange={setCur} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField label="Product cost per unit" value={v.unitCost} onChange={set("unitCost")} prefix={cur || undefined} />
            <NumberField label="Other costs per unit" value={v.extraCosts} onChange={set("extraCosts")} prefix={cur || undefined} hint="Packaging, labour, shipping you pay." />
            <NumberField label="Target profit margin" value={v.targetMargin} onChange={set("targetMargin")} suffix="%" hint="Profit as a share of the selling price." />
            <NumberField label="Platform / payment fee" value={v.feePercent} onChange={set("feePercent")} suffix="%" hint="Percentage of the sale price." />
            <NumberField label="Fixed fee per order" value={v.feeFixed} onChange={set("feeFixed")} prefix={cur || undefined} />
            <NumberField label="Sales tax / VAT to add" value={v.taxPercent} onChange={set("taxPercent")} suffix="%" hint="Enter your own rate; 0 if prices exclude tax." />
          </div>
          <Toolbar><ResetButton onClick={() => setV({ unitCost: "", extraCosts: "", feePercent: "", feeFixed: "", targetMargin: "", taxPercent: "" })} /></Toolbar>
          {invalid && <Alert kind="error">All values must be zero or positive numbers.</Alert>}
          {!invalid && !res && <Alert kind="error">Fee percentage plus target margin must be below 100%, otherwise no price can achieve it.</Alert>}
        </div>
      </Panel>
      {res && (
        <Panel title="Recommended price">
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Selling price (before tax)" value={formatMoney(res.price, cur)} highlight />
              <Stat label="Price incl. tax" value={formatMoney(res.priceWithTax, cur)} sub={`Tax ${formatMoney(res.tax, cur)}`} />
              <Stat label="Profit per unit" value={formatMoney(res.profit, cur)} sub={`${fmt(n.targetMargin)}% margin`} />
              <Stat label="Fees per unit" value={formatMoney(res.fees, cur)} sub={res.markup !== null ? `Markup ${fmt(res.markup, 1)}%` : undefined} />
            </div>
            <Explain>
              <p>Total cost = {formatMoney(n.unitCost, cur)} + {formatMoney(n.extraCosts, cur)} = {formatMoney(res.cost, cur)}</p>
              <p>Price = (total cost + fixed fee) ÷ (1 − fee% − margin%) = ({fmt(res.cost, 4)} + {fmt(n.feeFixed, 4)}) ÷ (1 − {fmt(n.feePercent / 100, 4)} − {fmt(n.targetMargin / 100, 4)}) = {fmt(res.price, 4)}</p>
              <p>Check: price − cost − fees = {fmt(res.profit, 4)}, which is {fmt((res.profit / res.price) * 100, 2)}% of the price.</p>
              <p>Tax is added on top of the price and passed to the tax authority; it is not profit.</p>
            </Explain>
          </div>
        </Panel>
      )}
    </div>
  );
}
