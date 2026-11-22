"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Checkbox, CopyButton, Panel, Stat, TextArea, Toolbar, ResetButton, fmt } from "@/components/ui";
import { formatDuration, textStats, topWords } from "@/lib/calc/text";
import type { ToolProps } from "../ToolRenderer";

export default function WordCounter({ slug }: ToolProps) {
  const [text, setText] = useState("");
  const [skipStop, setSkipStop] = useState(true);
  const deferred = useDeferredValue(text);
  const s = useMemo(() => textStats(deferred), [deferred]);
  const top = useMemo(() => topWords(deferred, 10, skipStop), [deferred, skipStop]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Panel>
        <div className="space-y-3">
          <TextArea label="Your text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Start typing or paste your essay, article or post…" className="min-h-80 font-sans" spellCheck />
          <Toolbar>
            <CopyButton text={text} label="Copy text" tool={slug} />
            <ResetButton onClick={() => setText("")} />
          </Toolbar>
        </div>
      </Panel>
      <div className="space-y-4">
        <Panel>
          <div className="grid grid-cols-2 gap-3" aria-live="polite">
            <Stat label="Words" value={fmt(s.words, 0)} highlight />
            <Stat label="Characters" value={fmt(s.chars, 0)} />
            <Stat label="Sentences" value={fmt(s.sentences, 0)} />
            <Stat label="Paragraphs" value={fmt(s.paragraphs, 0)} />
            <Stat label="Reading time" value={formatDuration(s.readingMinutes)} sub="at 238 wpm" />
            <Stat label="Speaking time" value={formatDuration(s.speakingMinutes)} sub="at 140 wpm" />
            <Stat label="Avg. words / sentence" value={s.sentences ? fmt(s.words / s.sentences, 1) : "—"} />
            <Stat label="No spaces" value={fmt(s.charsNoSpaces, 0)} sub="characters" />
          </div>
        </Panel>
        <Panel title="Most used words">
          <Checkbox label="Ignore common words (the, and, of…)" checked={skipStop} onChange={setSkipStop} />
          {top.length ? (
            <ol className="mt-3 space-y-1 text-sm">
              {top.map(([w, c]) => (
                <li key={w} className="flex justify-between gap-2"><span className="truncate text-ink">{w}</span><span className="tabular-nums text-muted">{c} · {fmt((c / Math.max(1, s.words)) * 100, 1)}%</span></li>
              ))}
            </ol>
          ) : <p className="mt-3 text-sm text-muted">No words yet.</p>}
        </Panel>
      </div>
    </div>
  );
}
