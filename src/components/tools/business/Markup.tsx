"use client";

import { useState } from "react";
import { Alert, Explain, NumberField, Panel, Segmented, Stat, fmt, num } from "@/components/ui";
import { formatMoney, markupFromPrice, priceFromMarkup } from "@/lib/calc/business";
import CurrencyField from "./Currency";

export default function Markup() {
  const [cur, setCur] = useState("$");
  const [mode, setMode] = useState<"price" | "markup">("price");
  const [cost, setCost] = useState("40");
  const [mk, setMk] = useState("50");
  const [price, setPrice] = useState("70");
  const c = num(cost);

  let out: React.ReactNode = null;
  let err = "";
  if (!Number.isFinite(c) || c < 0) err = cost === "" ? "" : "Cost must be zero or a positive number.";
  else if (mode === "price") {
    const m = num(mk);
    if (!Number.isFinite(m) || m < -100) err = mk === "" ? "" : "Markup must be a number above −100%.";
    else {
      const r = priceFromMarkup(c, m);
      out = (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Selling price" value={formatMoney(r.price, cur)} highlight />
            <Stat label="Profit" value={formatMoney(r.profit, cur)} />
            <Stat label="Equivalent margin" value={r.margin === null ? "—" : `${fmt(r.margin, 2)}%`} />
          </div>
          <Explain>
            <p>Price = cost × (1 + markup ÷ 100) = {fmt(c, 4)} × {fmt(1 + m / 100, 4)} = {fmt(r.price, 4)}</p>
            <p>Margin = profit ÷ price = {fmt(r.margin, 4)}%. Margin is always lower than markup for a profitable sale.</p>
          </Explain>
        </>
      );
    }
  } else {
    const p = num(price);
    const r = Number.isFinite(p) ? markupFromPrice(c, p) : null;
    if (!Number.isFinite(p) || p < 0) err = price === "" ? "" : "Price must be zero or a positive number.";
    else if (!r) err = "Markup is undefined when cost is zero.";
    else
      out = (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Markup" value={`${fmt(r.markup, 2)}%`} highlight />
            <Stat label="Profit" value={formatMoney(r.profit, cur)} />
            <Stat label="Margin" value={r.margin === null ? "—" : `${fmt(r.margin, 2)}%`} />
          </div>
          <Explain>
            <p>Markup = (price − cost) ÷ cost × 100 = ({fmt(p, 4)} − {fmt(c, 4)}) ÷ {fmt(c, 4)} × 100 = {fmt(r.markup, 4)}%</p>
          </Explain>
        </>
      );
  }

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <Segmented label="What do you want to find?" value={mode} onChange={setMode} options={[{ value: "price", label: "Selling price from markup" }, { value: "markup", label: "Markup from price" }]} />
          <div className="grid gap-4 sm:grid-cols-3">
            <CurrencyField value={cur} onChange={setCur} />
            <NumberField label="Cost" value={cost} onChange={setCost} prefix={cur || undefined} />
            {mode === "price" ? <NumberField label="Markup" value={mk} onChange={setMk} suffix="%" /> : <NumberField label="Selling price" value={price} onChange={setPrice} prefix={cur || undefined} />}
          </div>
          {err && <Alert kind="error">{err}</Alert>}
        </div>
      </Panel>
      {out && <Panel title="Result"><div className="space-y-4" aria-live="polite">{out}</div></Panel>}
    </div>
  );
}
