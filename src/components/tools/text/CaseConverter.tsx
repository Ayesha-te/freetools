"use client";

import { useState } from "react";
import { Button, CopyButton, DownloadTextButton, Panel, TextArea, Toolbar, ResetButton } from "@/components/ui";
import { convertCase, type CaseMode } from "@/lib/calc/text";
import type { ToolProps } from "../ToolRenderer";

const MODES: { m: CaseMode; label: string }[] = [
  { m: "upper", label: "UPPERCASE" },
  { m: "lower", label: "lowercase" },
  { m: "title", label: "Title Case" },
  { m: "sentence", label: "Sentence case" },
  { m: "camel", label: "camelCase" },
  { m: "pascal", label: "PascalCase" },
  { m: "snake", label: "snake_case" },
  { m: "kebab", label: "kebab-case" },
  { m: "constant", label: "CONSTANT_CASE" },
  { m: "dot", label: "dot.case" },
  { m: "alternating", label: "aLtErNaTiNg" },
  { m: "inverse", label: "iNVERSE cASE" },
];

export default function CaseConverter({ slug }: ToolProps) {
  const [text, setText] = useState("");
  const [last, setLast] = useState<CaseMode | null>(null);

  return (
    <Panel>
      <div className="space-y-4">
        <TextArea label="Text" value={text} onChange={(e) => { setText(e.target.value); setLast(null); }} placeholder="Type or paste text, then choose a case…" className="min-h-56 font-sans" />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Convert to">
          {MODES.map(({ m, label }) => (
            <Button key={m} variant={last === m ? "primary" : "secondary"} onClick={() => { setText(convertCase(text, m)); setLast(m); }} disabled={!text}>
              {label}
            </Button>
          ))}
        </div>
        <Toolbar>
          <CopyButton text={text} tool={slug} />
          <DownloadTextButton text={text} filename="converted.txt" tool={slug} />
          <ResetButton onClick={() => { setText(""); setLast(null); }} />
        </Toolbar>
        <p className="text-xs text-muted">Title Case keeps short words (a, of, the, and…) lowercase except at the start. Programming cases split on spaces, punctuation and existing camelCase boundaries and drop symbols.</p>
      </div>
    </Panel>
  );
}
