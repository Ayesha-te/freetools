"use client";

import { useMemo, useState } from "react";
import { Checkbox, CopyButton, DownloadTextButton, Panel, Stat, TextArea, Toolbar, ResetButton, Button, fmt } from "@/components/ui";
import { cleanSpaces, type CleanOptions } from "@/lib/calc/text";
import type { ToolProps } from "../ToolRenderer";

export default function RemoveSpaces({ slug }: ToolProps) {
  const [text, setText] = useState("");
  const [o, setO] = useState<CleanOptions>({ collapseSpaces: true, trimLines: true, removeEmptyLines: false, tabsToSpaces: true, joinLines: false, collapseBlankLines: true });
  const set = (k: keyof CleanOptions) => (v: boolean) => setO((s) => ({ ...s, [k]: v }));
  const out = useMemo(() => cleanSpaces(text, o), [text, o]);

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <TextArea label="Original text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text with messy spacing, e.g. copied from a PDF…" className="min-h-48 font-sans" />
          <fieldset className="grid gap-2 sm:grid-cols-2">
            <legend className="mb-2 text-sm font-semibold text-ink">Clean-up options</legend>
            <Checkbox label="Collapse multiple spaces into one" checked={o.collapseSpaces} onChange={set("collapseSpaces")} />
            <Checkbox label="Trim spaces at start and end of lines" checked={o.trimLines} onChange={set("trimLines")} />
            <Checkbox label="Convert tabs to spaces" checked={o.tabsToSpaces} onChange={set("tabsToSpaces")} />
            <Checkbox label="Reduce multiple blank lines to one" checked={o.collapseBlankLines} onChange={set("collapseBlankLines")} />
            <Checkbox label="Remove all empty lines" checked={o.removeEmptyLines} onChange={set("removeEmptyLines")} />
            <Checkbox label="Join broken lines (keep paragraph breaks)" checked={o.joinLines} onChange={set("joinLines")} hint="Fixes text pasted from PDFs." />
          </fieldset>
          <Toolbar>
            <Button variant="ghost" onClick={() => setText("This   text  has\t\ttabs and    extra spaces.   \n\n\n\n   Lines are\nbroken in the middle\nlike a PDF copy.   ")}>Load sample</Button>
            <ResetButton onClick={() => setText("")} />
          </Toolbar>
        </div>
      </Panel>
      <Panel title="Cleaned text">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3" aria-live="polite">
            <Stat label="Characters before" value={fmt(text.length, 0)} />
            <Stat label="Characters after" value={fmt(out.length, 0)} sub={text.length ? `${fmt(text.length - out.length, 0)} removed` : undefined} highlight />
          </div>
          <TextArea aria-label="Cleaned text" value={out} readOnly className="min-h-48 font-sans" />
          <Toolbar>
            <CopyButton text={out} tool={slug} />
            <DownloadTextButton text={out} filename="cleaned.txt" tool={slug} />
          </Toolbar>
        </div>
      </Panel>
    </div>
  );
}
