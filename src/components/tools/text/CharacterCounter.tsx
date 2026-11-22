"use client";

import { useMemo, useState } from "react";
import { CopyButton, NumberField, Panel, Stat, TextArea, Toolbar, ResetButton, cx, fmt, num } from "@/components/ui";
import { textStats } from "@/lib/calc/text";
import type { ToolProps } from "../ToolRenderer";

const LIMITS = [
  { label: "SEO title (approx.)", max: 60 },
  { label: "Meta description (approx.)", max: 160 },
  { label: "Single SMS (GSM-7)", max: 160 },
  { label: "X / Twitter post", max: 280 },
  { label: "Instagram caption", max: 2200 },
];

export default function CharacterCounter({ slug }: ToolProps) {
  const [text, setText] = useState("");
  const [custom, setCustom] = useState("");
  const s = useMemo(() => textStats(text), [text]);
  const limits = [...LIMITS, ...(num(custom) > 0 ? [{ label: "Your limit", max: num(custom) }] : [])];

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-3">
          <TextArea label="Text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text…" className="min-h-48 font-sans" spellCheck />
          <Toolbar>
            <CopyButton text={text} tool={slug} />
            <ResetButton onClick={() => setText("")} />
          </Toolbar>
        </div>
      </Panel>
      <Panel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-live="polite">
          <Stat label="Characters" value={fmt(s.chars, 0)} highlight />
          <Stat label="Without spaces" value={fmt(s.charsNoSpaces, 0)} />
          <Stat label="Words" value={fmt(s.words, 0)} />
          <Stat label="Lines" value={fmt(s.lines, 0)} />
          <Stat label="UTF-8 bytes" value={fmt(s.bytes, 0)} />
          <Stat label="UTF-16 units" value={fmt(text.length, 0)} sub="JS .length" />
        </div>
      </Panel>
      <Panel title="Common limits">
        <div className="space-y-3">
          {limits.map((l) => {
            const pct = Math.min(100, (s.chars / l.max) * 100);
            const over = s.chars > l.max;
            return (
              <div key={l.label}>
                <div className="flex justify-between text-sm"><span className="text-ink">{l.label}</span><span className={cx("tabular-nums", over ? "font-semibold text-danger" : "text-muted")}>{fmt(s.chars, 0)} / {fmt(l.max, 0)}{over ? ` (${fmt(s.chars - l.max, 0)} over)` : ""}</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2"><div className={cx("h-full", over ? "bg-danger" : "bg-primary")} style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
          <NumberField label="Custom limit" value={custom} onChange={setCustom} placeholder="e.g. 500" className="max-w-xs" />
          <p className="text-xs text-muted">Search engines truncate titles and descriptions by pixel width, not a fixed character count, so treat 60/160 as rough guides. SMS with emoji or non-Latin characters uses a 70-character limit.</p>
        </div>
      </Panel>
    </div>
  );
}
