"use client";

import { useEffect, useState } from "react";
import { Alert, Checkbox, CopyButton, Input, Panel, Segmented, TextArea } from "@/components/ui";
import FileDrop from "@/components/ui/FileDrop";
import { md5, toHex } from "@/lib/calc/dev";
import { formatBytes } from "@/lib/image";
import type { ToolProps } from "../ToolRenderer";

const ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
const MAX_FILE = 200 * 1024 * 1024;

async function hashAll(bytes: Uint8Array): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  out["MD5"] = bytes.length <= 50 * 1024 * 1024 ? md5(bytes) : "Skipped (MD5 limited to 50 MB)";
  for (const a of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]) out[a] = toHex(await crypto.subtle.digest(a, bytes as BufferSource));
  return out;
}

export default function HashTool({ slug }: ToolProps) {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<string, string> | null>(null);
  const [upper, setUpper] = useState(false);
  const [expected, setExpected] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode !== "text") return;
    let cancelled = false;
    if (!globalThis.crypto?.subtle) { setErr("Your browser does not support the Web Crypto API (it requires HTTPS)."); return; }
    hashAll(new TextEncoder().encode(text)).then((h) => !cancelled && setHashes(h));
    return () => { cancelled = true; };
  }, [text, mode]);

  async function onFile(files: File[]) {
    const f = files[0];
    setErr("");
    if (f.size > MAX_FILE) return setErr("Files larger than 200 MB are not supported in the browser.");
    setFile(f);
    setBusy(true);
    try {
      setHashes(await hashAll(new Uint8Array(await f.arrayBuffer())));
    } catch {
      setErr("The file could not be read.");
    } finally {
      setBusy(false);
    }
  }

  const exp = expected.trim().toLowerCase();
  const match = exp && hashes ? Object.entries(hashes).find(([, v]) => v.toLowerCase() === exp) : null;

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <Segmented label="Input type" value={mode} onChange={(m) => { setMode(m); setHashes(null); setFile(null); }} options={[{ value: "text", label: "Text" }, { value: "file", label: "File" }]} />
          {mode === "text" ? (
            <TextArea label="Text to hash (UTF-8)" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text…" className="min-h-32" />
          ) : (
            <>
              <FileDrop compact accept="*/*" onFiles={onFile} label="choose a file" hint="Any file up to 200 MB · hashed locally, never uploaded" />
              {file && <p className="text-sm text-ink-2">{file.name} · {formatBytes(file.size)}{busy && " · hashing…"}</p>}
            </>
          )}
          {err && <Alert kind="error">{err}</Alert>}
          <Checkbox label="Uppercase hex" checked={upper} onChange={setUpper} />
        </div>
      </Panel>
      {hashes && (
        <Panel title="Hashes">
          <div className="space-y-3" aria-live="polite">
            {mode === "text" && !text && <p className="text-sm text-muted">Showing hashes of an empty string.</p>}
            {ALGOS.map((a) => (
              <div key={a} className="rounded-lg border border-border bg-surface-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">{a}{(a === "MD5" || a === "SHA-1") && <span className="ml-2 text-xs font-normal text-warn">not collision-resistant</span>}</span>
                  <CopyButton text={upper ? hashes[a].toUpperCase() : hashes[a]} tool={slug} />
                </div>
                <code className="mt-1 block break-all font-mono text-sm text-ink-2">{upper ? hashes[a].toUpperCase() : hashes[a]}</code>
              </div>
            ))}
            <Input label="Compare with an expected checksum (optional)" value={expected} onChange={(e) => setExpected(e.target.value)} placeholder="Paste the published hash" className="font-mono" />
            {exp && (match ? <Alert kind="success">Match: this is the {match[0]} hash.</Alert> : <Alert kind="error">No match with any algorithm. The file or text differs from the original.</Alert>)}
          </div>
        </Panel>
      )}
    </div>
  );
}
