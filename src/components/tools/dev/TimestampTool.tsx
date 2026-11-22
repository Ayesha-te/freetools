"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Button, CopyButton, Input, Panel, Select, Stat } from "@/components/ui";
import { detectUnit, relativeTime, timestampToDate } from "@/lib/calc/dev";
import type { ToolProps } from "../ToolRenderer";

function Row({ label, value, tool }: { label: string; value: string; tool: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        <code className="break-all font-mono text-sm text-ink">{value}</code>
        <CopyButton text={value} label="Copy" tool={tool} />
      </span>
    </div>
  );
}
const pad = (n: number) => String(n).padStart(2, "0");
function toLocalInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function TimestampTool({ slug }: ToolProps) {
  const [now, setNow] = useState<number | null>(null);
  const [ts, setTs] = useState("");
  const [unit, setUnit] = useState<"auto" | "s" | "ms">("auto");
  const [dateStr, setDateStr] = useState("");
  const [zone, setZone] = useState<"local" | "utc">("local");

  useEffect(() => {
    setNow(Date.now());
    setTs(String(Math.floor(Date.now() / 1000)));
    setDateStr(toLocalInput(new Date()));
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const fromTs = useMemo(() => {
    if (!ts.trim()) return null;
    const n = Number(ts.trim());
    if (!Number.isFinite(n)) return { error: "Enter a numeric timestamp, e.g. 1700000000." };
    const u = unit === "auto" ? detectUnit(n) : unit;
    try {
      return { d: timestampToDate(n, u), u };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [ts, unit]);

  const fromDate = useMemo(() => {
    if (!dateStr) return null;
    const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return { error: "Choose a valid date and time." };
    const [y, mo, d, h, mi, s] = m.slice(1).map((x) => Number(x || 0));
    const ms = zone === "utc" ? Date.UTC(y, mo - 1, d, h, mi, s) : new Date(y, mo - 1, d, h, mi, s).getTime();
    return { ms };
  }, [dateStr, zone]);

  const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "local";

  return (
    <div className="space-y-4">
      <Panel>
        <div className="grid gap-3 sm:grid-cols-2" aria-live="off">
          <Stat label="Current Unix time (seconds)" value={now === null ? "…" : Math.floor(now / 1000)} highlight />
          <Stat label="Milliseconds" value={now === null ? "…" : now} />
        </div>
      </Panel>
      <Panel title="Timestamp → date">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <Input label="Unix timestamp" value={ts} onChange={(e) => setTs(e.target.value)} inputMode="numeric" placeholder="1700000000" />
            <Select label="Unit" value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)}>
              <option value="auto">Auto-detect</option>
              <option value="s">Seconds</option>
              <option value="ms">Milliseconds</option>
            </Select>
          </div>
          {fromTs?.error && <Alert kind="error">{fromTs.error}</Alert>}
          {fromTs?.d && (
            <div aria-live="polite">
              <p className="mb-1 text-xs text-muted">Interpreted as {fromTs.u === "s" ? "seconds" : "milliseconds"}.</p>
              <Row label="UTC (ISO 8601)" value={fromTs.d.toISOString()} tool={slug} />
              <Row label={`Local (${tz})`} value={fromTs.d.toLocaleString(undefined, { dateStyle: "full", timeStyle: "long" })} tool={slug} />
              <Row label="RFC 2822 / HTTP" value={fromTs.d.toUTCString()} tool={slug} />
              <Row label="Relative" value={relativeTime(fromTs.d, now ?? Date.now())} tool={slug} />
            </div>
          )}
        </div>
      </Panel>
      <Panel title="Date → timestamp">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <Input label="Date and time" type="datetime-local" step={1} value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
            <Select label="Interpret as" value={zone} onChange={(e) => setZone(e.target.value as typeof zone)}>
              <option value="local">Local time ({tz})</option>
              <option value="utc">UTC</option>
            </Select>
          </div>
          {fromDate?.error && <Alert kind="error">{fromDate.error}</Alert>}
          {fromDate?.ms !== undefined && (
            <div aria-live="polite">
              <Row label="Seconds" value={String(Math.floor(fromDate.ms / 1000))} tool={slug} />
              <Row label="Milliseconds" value={String(fromDate.ms)} tool={slug} />
              <Row label="UTC (ISO 8601)" value={new Date(fromDate.ms).toISOString()} tool={slug} />
            </div>
          )}
          <Button variant="ghost" onClick={() => setDateStr(toLocalInput(new Date()))}>Use current time</Button>
        </div>
      </Panel>
    </div>
  );
}
