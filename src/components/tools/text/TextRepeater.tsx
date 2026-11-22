"use client";

import { useState } from "react";
import { Alert, Button, Checkbox, CopyButton, DownloadTextButton, Input, NumberField, Panel, Select, TextArea, Toolbar, ResetButton, fmt, num } from "@/components/ui";
import { repeatText } from "@/lib/calc/text";
import { track } from "@/lib/analytics";
import type { ToolProps } from "../ToolRenderer";

const SEPS: Record<string, string> = { newline: "\n", space: " ", none: "", comma: ", ", custom: "" };

export default function TextRepeater({ slug }: ToolProps) {
  const [text, setText] = useState("");
  const [times, setTimes] = useState("10");
  const [sep, setSep] = useState("newline");
  const [customSep, setCustomSep] = useState(" | ");
  const [numbered, setNumbered] = useState(false);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  function run() {
    setErr("");
    if (!text) return setErr("Enter some text to repeat.");
    try {
      setOut(repeatText(text, Math.floor(num(times)), sep === "custom" ? customSep.replace(/\\n/g, "\n") : SEPS[sep], numbered));
      track("tool_complete", { tool: slug });
    } catch (e) {
      setErr((e as Error).message);
      setOut("");
    }
  }

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <TextArea label="Text to repeat" value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 font-sans" placeholder="e.g. Happy birthday!" />
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField label="Repeat count" value={times} onChange={setTimes} min={1} max={10000} step={1} hint="1 – 10,000" />
            <Select label="Separator" value={sep} onChange={(e) => setSep(e.target.value)}>
              <option value="newline">New line</option>
              <option value="space">Space</option>
              <option value="comma">Comma</option>
              <option value="none">Nothing</option>
              <option value="custom">Custom…</option>
            </Select>
            {sep === "custom" && <Input label="Custom separator" value={customSep} onChange={(e) => setCustomSep(e.target.value)} hint="Use \n for a line break." />}
          </div>
          <Checkbox label="Number each repetition (1. 2. 3.)" checked={numbered} onChange={setNumbered} />
          <Toolbar>
            <Button onClick={run}>Repeat text</Button>
            <ResetButton onClick={() => { setText(""); setOut(""); setErr(""); }} />
          </Toolbar>
          {err && <Alert kind="error">{err}</Alert>}
        </div>
      </Panel>
      {out && (
        <Panel title={`Result · ${fmt(out.length, 0)} characters`}>
          <div className="space-y-3">
            <TextArea aria-label="Repeated text" value={out.length > 200000 ? out.slice(0, 200000) : out} readOnly className="min-h-56 font-sans" />
            {out.length > 200000 && <p className="text-xs text-muted">Preview shows the first 200,000 characters. Copy or download gets the full text.</p>}
            <Toolbar>
              <CopyButton text={out} tool={slug} />
              <DownloadTextButton text={out} filename="repeated.txt" tool={slug} />
            </Toolbar>
          </div>
        </Panel>
      )}
    </div>
  );
}
