"use client";

import { useState } from "react";
import { Alert, Explain, NumberField, Panel, Segmented, Stat, Toolbar, ResetButton, fmt, num } from "@/components/ui";
import { formatMoney, shippingCost } from "@/lib/calc/business";
import CurrencyField from "./Currency";

export default function Shipping() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [cur, setCur] = useState("$");
  const [v, setV] = useState({ weight: "2", length: "40", width: "30", height: "20", divisor: "5000", quantity: "1", baseFee: "5", ratePerUnit: "3.5", fuelPercent: "0", handling: "0" });
  const set = (k: keyof typeof v) => (x: string) => setV((s) => ({ ...s, [k]: x }));
  const n = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, x === "" ? 0 : num(x)])) as Record<keyof typeof v, number>;
  const valid = Object.values(n).every((x) => Number.isFinite(x) && x >= 0) && n.divisor > 0 && n.quantity >= 1;
  const res = valid ? shippingCost(n) : null;
  const wu = unit === "metric" ? "kg" : "lb";
  const du = unit === "metric" ? "cm" : "in";

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <Alert kind="info">This calculator does not fetch live carrier prices. Enter the rates from your carrier's price list or contract to get an estimate.</Alert>
          <Segmented label="Units" value={unit} onChange={(u) => { setUnit(u); setV((s) => ({ ...s, divisor: u === "metric" ? "5000" : "139" })); }} options={[{ value: "metric", label: "Metric (kg, cm)" }, { value: "imperial", label: "Imperial (lb, in)" }]} />
          <fieldset className="grid gap-4 sm:grid-cols-4">
            <legend className="mb-2 text-sm font-semibold text-ink">Parcel</legend>
            <NumberField label="Actual weight" value={v.weight} onChange={set("weight")} suffix={wu} />
            <NumberField label="Length" value={v.length} onChange={set("length")} suffix={du} />
            <NumberField label="Width" value={v.width} onChange={set("width")} suffix={du} />
            <NumberField label="Height" value={v.height} onChange={set("height")} suffix={du} />
            <NumberField label="Number of parcels" value={v.quantity} onChange={set("quantity")} min={1} step={1} />
            <NumberField label="Volumetric divisor" value={v.divisor} onChange={set("divisor")} hint={unit === "metric" ? "Often 5000 or 6000 for cm/kg." : "Often 139 or 166 for in/lb."} className="sm:col-span-3" />
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-4">
            <legend className="mb-2 text-sm font-semibold text-ink">Your carrier rates</legend>
            <CurrencyField value={cur} onChange={setCur} />
            <NumberField label="Base fee per parcel" value={v.baseFee} onChange={set("baseFee")} prefix={cur || undefined} />
            <NumberField label={`Rate per ${wu}`} value={v.ratePerUnit} onChange={set("ratePerUnit")} prefix={cur || undefined} />
            <NumberField label="Fuel surcharge" value={v.fuelPercent} onChange={set("fuelPercent")} suffix="%" />
            <NumberField label="Handling / packaging (total)" value={v.handling} onChange={set("handling")} prefix={cur || undefined} />
          </fieldset>
          <Toolbar><ResetButton onClick={() => setV({ weight: "", length: "", width: "", height: "", divisor: unit === "metric" ? "5000" : "139", quantity: "1", baseFee: "", ratePerUnit: "", fuelPercent: "", handling: "" })} /></Toolbar>
          {!valid && <Alert kind="error">Use non-negative numbers, a divisor above zero and at least one parcel.</Alert>}
        </div>
      </Panel>
      {res && (
        <Panel title="Estimate">
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Volumetric weight" value={`${fmt(res.volumetric, 2)} ${wu}`} sub="per parcel" />
              <Stat label="Chargeable weight" value={`${fmt(res.chargeable, 2)} ${wu}`} sub={res.usesVolumetric ? "Volumetric is higher" : "Actual is higher"} />
              <Stat label="Fuel surcharge" value={formatMoney(res.fuel, cur)} />
              <Stat label="Estimated total" value={formatMoney(res.total, cur)} highlight />
            </div>
            <Explain>
              <p>Volumetric weight = L × W × H ÷ divisor = {fmt(n.length)} × {fmt(n.width)} × {fmt(n.height)} ÷ {fmt(n.divisor)} = {fmt(res.volumetric, 3)} {wu}</p>
              <p>Chargeable weight = max(actual, volumetric) × parcels = {fmt(res.chargeablePer, 3)} × {fmt(n.quantity)} = {fmt(res.chargeable, 3)} {wu}</p>
              <p>Transport = base fee × parcels + chargeable × rate = {fmt(res.transport, 2)}; fuel = transport × {fmt(n.fuelPercent)}%; total = transport + fuel + handling.</p>
              <p>Carriers may round weight up to the next 0.5 or 1 {wu} and add remote-area, oversize or customs charges not included here.</p>
            </Explain>
          </div>
        </Panel>
      )}
    </div>
  );
}
