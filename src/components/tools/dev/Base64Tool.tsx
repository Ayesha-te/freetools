"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Alert, Button, Checkbox, CopyButton, Panel, Segmented, TextArea, Toolbar, ResetButton } from "@/components/ui";
import FileDrop from "@/components/ui/FileDrop";
import { bytesToBase64, decodeBase64, encodeBase64 } from "@/lib/calc/dev";
import { downloadBlob, formatBytes, safeFilename } from "@/lib/image";
import type { ToolProps } from "../ToolRenderer";

const MAX_FILE = 10 * 1024 * 1024;

export default function Base64Tool({ slug }: ToolProps) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [fileOut, setFileOut] = useState<{ name: string; b64: string; type: string; size: number } | null>(null);
  const [fileErr, setFileErr] = useState("");

  const res = useMemo(() => {
    if (!input) return { out: "" };
    try {
      if (mode === "encode") return { out: encodeBase64(input, urlSafe) };
      const d = decodeBase64(input);
      return { out: d.text, binary: !d.validUtf8, bytes: d.bytes };
    } catch (e) {
      return { out: "", error: (e as Error).message };
    }
  }, [input, mode, urlSafe]);

  async function onFile(files: File[]) {
    setFileErr("");
    const f = files[0];
    if (f.size > MAX_FILE) return setFileErr("Files larger than 10 MB are not supported; Base64 output would be over 13 MB.");
    const b = new Uint8Array(await f.arrayBuffer());
    setFileOut({ name: f.name, b64: bytesToBase64(b), type: f.type || "application/octet-stream", size: f.size });
  }

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <Segmented label="Mode" value={mode} onChange={(m) => { setMode(m); setInput(res.error ? "" : res.out); }} options={[{ value: "encode", label: "Encode" }, { value: "decode", label: "Decode" }]} />
          <TextArea label={mode === "encode" ? "Text to encode" : "Base64 to decode"} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? "Type or paste text…" : "Paste Base64, e.g. SGVsbG8gd29ybGQ="} />
          {mode === "encode" && <Checkbox label="URL-safe output (- and _ instead of + and /, no padding)" checked={urlSafe} onChange={setUrlSafe} />}
          {res.error && <Alert kind="error">{res.error}</Alert>}
          {res.binary && <Alert kind="warn">The decoded data is not valid UTF-8 text — it is probably a binary file. Download it instead of copying.</Alert>}
          <TextArea label="Result" value={res.out} readOnly aria-live="polite" />
          <Toolbar>
            <CopyButton text={res.out} tool={slug} />
            {mode === "decode" && res.bytes && (
              <Button variant="secondary" onClick={() => downloadBlob(new Blob([res.bytes as BlobPart]), "decoded.bin")}>
                <Download className="h-4 w-4" aria-hidden /> Download as file
              </Button>
            )}
            <Button variant="ghost" onClick={() => setInput(mode === "encode" ? "Hello, world! ✓ Ünïcödé" : "SGVsbG8sIHdvcmxkISDinJMgw5xuw69jw7Zkw6k=")}>Load sample</Button>
            <ResetButton onClick={() => setInput("")} />
          </Toolbar>
        </div>
      </Panel>
      <Panel title="Encode a file to Base64">
        <div className="space-y-3">
          <FileDrop compact accept="*/*" onFiles={onFile} label="choose a file" hint="Any file up to 10 MB · read locally, never uploaded" />
          {fileErr && <Alert kind="error">{fileErr}</Alert>}
          {fileOut && (
            <>
              <p className="text-sm text-ink-2">{fileOut.name} · {formatBytes(fileOut.size)} → {formatBytes(fileOut.b64.length)} of Base64</p>
              <Toolbar>
                <CopyButton text={fileOut.b64} label="Copy Base64" tool={slug} />
                <CopyButton text={`data:${fileOut.type};base64,${fileOut.b64}`} label="Copy data URI" tool={slug} />
                <Button variant="secondary" onClick={() => downloadBlob(new Blob([fileOut.b64], { type: "text/plain" }), safeFilename(fileOut.name, "txt", "-base64"))}>
                  <Download className="h-4 w-4" aria-hidden /> Download .txt
                </Button>
              </Toolbar>
            </>
          )}
        </div>
      </Panel>
    </div>
  );
}
