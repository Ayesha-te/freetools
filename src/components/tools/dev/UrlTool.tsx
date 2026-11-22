"use client";

import { useMemo, useState } from "react";
import { Alert, Button, Checkbox, CopyButton, Panel, Segmented, Select, TextArea, Toolbar, ResetButton } from "@/components/ui";
import { urlDecode, urlEncode } from "@/lib/calc/dev";
import type { ToolProps } from "../ToolRenderer";

export default function UrlTool({ slug }: ToolProps) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [kind, setKind] = useState<"component" | "uri">("component");
  const [plus, setPlus] = useState(false);
  const [input, setInput] = useState("");

  const res = useMemo(() => {
    if (!input) return { out: "" };
    try {
      return { out: mode === "encode" ? urlEncode(input, kind, plus) : urlDecode(input, plus) };
    } catch (e) {
      return { out: "", error: (e as Error).message };
    }
  }, [input, mode, kind, plus]);

  const params = useMemo(() => {
    const src = mode === "decode" ? input.trim() : res.out;
    try {
      const u = new URL(mode === "decode" ? src : input.trim());
      return [...u.searchParams.entries()];
    } catch {
      return null;
    }
  }, [input, res.out, mode]);

  return (
    <Panel>
      <div className="space-y-4">
        <Segmented label="Mode" value={mode} onChange={setMode} options={[{ value: "encode", label: "Encode" }, { value: "decode", label: "Decode" }]} />
        <div className="flex flex-wrap items-end gap-4">
          {mode === "encode" && (
            <Select label="Encoding rules" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="w-72" hint={kind === "component" ? "Encodes everything except A–Z a–z 0–9 - _ . ! ~ * ' ( )" : "Keeps URL structure (: / ? # & =) intact"}>
              <option value="component">Query value / path segment (encodeURIComponent)</option>
              <option value="uri">Full URL (encodeURI)</option>
            </Select>
          )}
          <div className="mb-2"><Checkbox label={mode === "encode" ? "Use + for spaces (form encoding)" : "Treat + as a space"} checked={plus} onChange={setPlus} /></div>
        </div>
        <TextArea label="Input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? "e.g. name=Jane Doe & city=São Paulo" : "e.g. Jane%20Doe%20%26%20co"} />
        {res.error && <Alert kind="error">{res.error}</Alert>}
        <TextArea label="Result" value={res.out} readOnly aria-live="polite" />
        <Toolbar>
          <CopyButton text={res.out} tool={slug} />
          <Button variant="ghost" onClick={() => setInput(mode === "encode" ? "search query=café & croissants/2024" : "https://example.com/search?q=caf%C3%A9%20%26%20croissants&page=2")}>Load sample</Button>
          <ResetButton onClick={() => setInput("")} />
        </Toolbar>
        {params && params.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink">Query parameters</h3>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 text-left text-muted"><tr><th className="px-3 py-2 font-medium">Key</th><th className="px-3 py-2 font-medium">Decoded value</th></tr></thead>
                <tbody>
                  {params.map(([k, v], i) => <tr key={i} className="border-t border-border"><td className="px-3 py-2 font-mono text-ink">{k}</td><td className="break-all px-3 py-2 font-mono text-ink-2">{v}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
