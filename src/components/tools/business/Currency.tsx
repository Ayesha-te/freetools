"use client";

import { useId } from "react";

export const CURRENCIES = ["$", "€", "£", "¥", "₹", "₨", "R", "A$", "C$", "AED ", "SAR ", "₦", "R$", "CHF ", ""];

export default function CurrencyField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = useId();
  const listId = `${id}-list`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        Currency symbol
      </label>
      <input id={id} list={listId} value={value} maxLength={5} onChange={(e) => onChange(e.target.value)} className="min-h-10 w-28 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-ink" />
      <datalist id={listId}>
        {CURRENCIES.filter(Boolean).map((c) => <option key={c} value={c} />)}
      </datalist>
    </div>
  );
}
