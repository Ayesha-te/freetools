"use client";

import { useState } from "react";
import { Alert, Explain, NumberField, Panel, Segmented, Stat, fmt, num } from "@/components/ui";
import { addVat, formatMoney, removeVat } from "@/lib/calc/business";
import CurrencyField from "./Currency";

const QUICK = ["5", "7.5", "10", "15", "17", "18", "20", "21", "23", "25"];

export default function Vat() {
  const [cur, setCur] = useState("£");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState("20");
  const a = num(amount), r = num(rate);
  const valid = Number.isFinite(a) && Number.isFinite(r) && a >= 0 && r >= 0 && r <= 100;
  const res = valid ? (mode === "add" ? addVat(a, r) : removeVat(a, r)) : null;

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <Segmented label="Mode" value={mode} onChange={setMode} options={[{ value: "add", label: "Add VAT (net → gross)" }, { value: "remove", label: "Remove VAT (gross → net)" }]} />
          <div className="grid gap-4 sm:grid-cols-3">
            <CurrencyField value={cur} onChange={setCur} />
            <NumberField label={mode === "add" ? "Net amount (excl. VAT)" : "Gross amount (incl. VAT)"} value={amount} onChange={setAmount} prefix={cur || undefined} />
            <NumberField label="VAT / tax rate" value={rate} onChange={setRate} suffix="%" />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Quick rates">
            {QUICK.map((q) => (
              <button key={q} type="button" onClick={() => setRate(q)} className={`min-h-9 rounded-md border px-3 text-sm ${rate === q ? "border-primary bg-primary-soft text-primary-ink" : "border-border text-ink-2 hover:bg-surface-2"}`}>
                {q}%
              </button>
            ))}
          </div>
          <p className="text-xs text-muted">Quick rates are shortcuts only — they are not linked to any country. Rates change, and many countries have reduced rates for certain goods. Confirm the correct rate with your tax authority.</p>
          {!valid && <Alert kind="error">Enter a non-negative amount and a rate between 0 and 100%.</Alert>}
        </div>
      </Panel>
      {res && (
        <Panel title="Result">
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Net (excl. VAT)" value={formatMoney(res.net, cur)} highlight={mode === "remove"} />
              <Stat label={`VAT at ${fmt(r)}%`} value={formatMoney(res.vat, cur)} />
              <Stat label="Gross (incl. VAT)" value={formatMoney(res.gross, cur)} highlight={mode === "add"} />
            </div>
            <Explain>
              {mode === "add" ? (
                <p>VAT = net × rate ÷ 100 = {fmt(a, 4)} × {fmt(r / 100, 4)} = {fmt(res.vat, 4)}; gross = net + VAT.</p>
              ) : (
                <>
                  <p>Net = gross ÷ (1 + rate ÷ 100) = {fmt(a, 4)} ÷ {fmt(1 + r / 100, 4)} = {fmt(res.net, 4)}; VAT = gross − net.</p>
                  <p>Common mistake: taking {fmt(r)}% of the gross price gives {formatMoney(a * r / 100, cur)}, which overstates the VAT.</p>
                </>
              )}
            </Explain>
          </div>
        </Panel>
      )}
    </div>
  );
}
