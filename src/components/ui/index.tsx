"use client";

import { useId, useState, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { Check, Copy, AlertCircle, CheckCircle2, Info, Download, RotateCcw } from "lucide-react";
import { track } from "@/lib/analytics";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "danger";
export function Button({ variant = "primary", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const styles: Record<Variant, string> = {
    primary: "bg-primary text-white hover:bg-primary-hover border-transparent",
    secondary: "bg-surface text-ink border-border-strong hover:bg-surface-2",
    ghost: "bg-transparent text-ink-2 border-transparent hover:bg-surface-2",
    danger: "bg-surface text-danger border-border-strong hover:bg-danger-soft",
  };
  return (
    <button
      type="button"
      {...p}
      className={cx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
    />
  );
}

export function Field({ label, hint, children, htmlFor, className }: { label: string; hint?: ReactNode; children: ReactNode; htmlFor?: string; className?: string }) {
  return (
    <div className={cx("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full min-w-0 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

export function Input({ label, hint, className, id, ...p }: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: ReactNode }) {
  const auto = useId();
  const iid = id || auto;
  const el = <input id={iid} {...p} className={cx(inputCls, "min-h-10", !label && className)} />;
  return label ? (
    <Field label={label} hint={hint} htmlFor={iid} className={className}>
      {el}
    </Field>
  ) : (
    el
  );
}

export function NumberField({
  label, value, onChange, hint, min, max, step, suffix, prefix, className, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; hint?: ReactNode; min?: number; max?: number; step?: number | "any"; suffix?: string; prefix?: string; className?: string; placeholder?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <div className="flex items-stretch">
        {prefix && <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border-strong bg-surface-2 px-3 text-sm text-muted">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step ?? "any"}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cx(inputCls, "min-h-10", prefix && "rounded-l-none", suffix && "rounded-r-none")}
        />
        {suffix && <span className="inline-flex items-center rounded-r-lg border border-l-0 border-border-strong bg-surface-2 px-3 text-sm text-muted">{suffix}</span>}
      </div>
    </Field>
  );
}

export function TextArea({ label, hint, className, id, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: ReactNode }) {
  const auto = useId();
  const iid = id || auto;
  const el = <textarea id={iid} spellCheck={false} {...p} className={cx(inputCls, "min-h-40 resize-y font-mono leading-relaxed", !label && className)} />;
  return label ? (
    <Field label={label} hint={hint} htmlFor={iid} className={className}>
      {el}
    </Field>
  ) : (
    el
  );
}

export function Select({ label, hint, className, id, children, ...p }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; hint?: ReactNode }) {
  const auto = useId();
  const iid = id || auto;
  const el = (
    <select id={iid} {...p} className={cx(inputCls, "min-h-10 pr-8", !label && className)}>
      {children}
    </select>
  );
  return label ? (
    <Field label={label} hint={hint} htmlFor={iid} className={className}>
      {el}
    </Field>
  ) : (
    el
  );
}

export function Checkbox({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const id = useId();
  return (
    <div className="flex items-start gap-2">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]" />
      <label htmlFor={id} className="text-sm text-ink-2">
        {label}
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </label>
    </div>
  );
}

export function Segmented<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-border bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            "min-h-9 rounded-md px-3 text-sm font-medium transition-colors",
            value === o.value ? "bg-surface text-primary shadow-sm" : "text-ink-2 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Alert({ kind = "info", children, title }: { kind?: "info" | "error" | "success" | "warn"; children: ReactNode; title?: string }) {
  const map = {
    info: { cls: "border-primary/30 bg-primary-soft text-primary-ink", Icon: Info },
    error: { cls: "border-danger/40 bg-danger-soft text-danger", Icon: AlertCircle },
    success: { cls: "border-success/40 bg-success-soft text-success", Icon: CheckCircle2 },
    warn: { cls: "border-warn/40 bg-warn-soft text-warn", Icon: AlertCircle },
  }[kind];
  return (
    <div role={kind === "error" ? "alert" : "status"} className={cx("flex gap-3 rounded-lg border px-4 py-3 text-sm", map.cls)}>
      <map.Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0 break-words">
        {title && <p className="font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}

export function CopyButton({ text, label = "Copy", tool, disabled }: { text: string; label?: string; tool?: string; disabled?: boolean }) {
  const [state, setState] = useState<"idle" | "ok" | "err">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("ok");
      if (tool) track("tool_copy", { tool });
    } catch {
      setState("err");
    }
    setTimeout(() => setState("idle"), 2000);
  }
  return (
    <Button variant="secondary" onClick={copy} disabled={disabled || !text} aria-live="polite">
      {state === "ok" ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      {state === "ok" ? "Copied" : state === "err" ? "Copy failed" : label}
    </Button>
  );
}

export function DownloadTextButton({ text, filename, mime = "text/plain", label = "Download", tool }: { text: string; filename: string; mime?: string; label?: string; tool?: string }) {
  return (
    <Button
      variant="secondary"
      disabled={!text}
      onClick={() => {
        const blob = new Blob([text], { type: `${mime};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        if (tool) track("tool_download", { tool });
      }}
    >
      <Download className="h-4 w-4" aria-hidden />
      {label}
    </Button>
  );
}

export function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <RotateCcw className="h-4 w-4" aria-hidden />
      Reset
    </Button>
  );
}

export function Panel({ children, className, title }: { children: ReactNode; className?: string; title?: string }) {
  return (
    <section className={cx("rounded-xl border border-border bg-surface p-4 sm:p-5", className)} aria-label={title}>
      {title && <h2 className="mb-3 text-base font-semibold text-ink">{title}</h2>}
      {children}
    </section>
  );
}

export function Stat({ label, value, sub, highlight }: { label: string; value: ReactNode; sub?: ReactNode; highlight?: boolean }) {
  return (
    <div className={cx("min-w-0 rounded-lg border px-4 py-3", highlight ? "border-primary/40 bg-primary-soft" : "border-border bg-surface-2")}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={cx("mt-1 break-words text-xl font-bold tabular-nums", highlight ? "text-primary-ink" : "text-ink")}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function Explain({ children }: { children: ReactNode }) {
  return (
    <details className="rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-ink-2">
      <summary className="cursor-pointer font-medium text-ink">How this was calculated</summary>
      <div className="mt-2 space-y-1 leading-relaxed">{children}</div>
    </details>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

/** Parse a numeric input string; returns NaN for empty. */
export function num(v: string) {
  if (v === undefined || v === null || String(v).trim() === "") return NaN;
  return Number(v);
}
export function fmt(n: number | null | undefined, d = 2) {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: 0 });
}
