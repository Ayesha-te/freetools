"use client";

import { useState } from "react";
import { Alert, Explain, NumberField, Panel, Select, Stat, Toolbar, ResetButton, fmt, num } from "@/components/ui";
import { applyDiscounts, formatMoney } from "@/lib/calc/business";
import CurrencyField from "./Currency";

export default function Discount() {
  const [cur, setCur] = useState("$");
  const [price, setPrice] = useState("80");
  const [t1, setT1] = useState<"percent" | "fixed">("percent");
  const [d1, setD1] = useState("25");
  const [t2, setT2] = useState<"percent" | "fixed">("percent");
  const [d2, setD2] = useState("");
  const [tax, setTax] = useState("");

  const p = num(price);
  const discounts = [
    { type: t1, value: num(d1) },
    ...(d2 !== "" ? [{ type: t2, value: num(d2) }] : []),
  ];
  const badPct = discounts.some((d) => d.type === "percent" && (d.value < 0 || d.value > 100));
  const valid = Number.isFinite(p) && p >= 0 && discounts.every((d) => Number.isFinite(d.value) && d.value >= 0) && !badPct;
  const taxN = tax === "" ? 0 : num(tax);
  const res = valid && Number.isFinite(taxN) ? applyDiscounts(p, discounts, taxN) : null;

  const typeSel = (val: string, on: (v: "percent" | "fixed") => void, label: string) => (
    <Select label={label} value={val} onChange={(e) => on(e.target.value as "percent" | "fixed")}>
      <option value="percent">Percent off (%)</option>
      <option value="fixed">Amount off ({cur || "fixed"})</option>
    </Select>
  );

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <CurrencyField value={cur} onChange={setCur} />
            <NumberField label="Original price" value={price} onChange={setPrice} prefix={cur || undefined} min={0} />
            <NumberField label="Sales tax (optional)" value={tax} onChange={setTax} suffix="%" placeholder="0" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {typeSel(t1, setT1, "Discount type")}
            <NumberField label="Discount" value={d1} onChange={setD1} suffix={t1 === "percent" ? "%" : undefined} prefix={t1 === "fixed" ? cur || undefined : undefined} />
            {typeSel(t2, setT2, "Extra discount type (optional)")}
            <NumberField label="Extra discount (applied after the first)" value={d2} onChange={setD2} placeholder="None" suffix={t2 === "percent" ? "%" : undefined} prefix={t2 === "fixed" ? cur || undefined : undefined} />
          </div>
          <Toolbar><ResetButton onClick={() => { setPrice(""); setD1(""); setD2(""); setTax(""); }} /></Toolbar>
          {!valid && price !== "" && <Alert kind="error">{badPct ? "Percentage discounts must be between 0 and 100." : "Enter valid, non-negative numbers."}</Alert>}
        </div>
      </Panel>
      {res && (
        <Panel title="Result">
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Final price" value={formatMoney(res.final, cur)} highlight />
              <Stat label="You save" value={formatMoney(res.saved, cur)} />
              <Stat label="Effective discount" value={`${fmt(res.effectivePercent, 2)}%`} />
              <Stat label="With tax" value={formatMoney(res.finalWithTax, cur)} sub={taxN ? `Tax ${formatMoney(res.tax, cur)}` : "No tax entered"} />
            </div>
            <Explain>
              <p>Percent discounts: price × (1 − discount ÷ 100). Fixed discounts: price − amount.</p>
              {d2 !== "" && <p>Stacked discounts are applied one after another, so 20% + 10% equals {fmt(100 - 80 * 0.9)}% in total, not 30%.</p>}
              <p>Tax is calculated on the discounted price, which is the usual rule, but check local regulations for coupons.</p>
            </Explain>
          </div>
        </Panel>
      )}
    </div>
  );
}
