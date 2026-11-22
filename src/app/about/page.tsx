import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { categories, categoryHref, tools } from "@/lib/tools/registry";

export const metadata: Metadata = pageMeta({
  title: "About ToolSprint – Free, Private Browser-Based Tools",
  description: "Why ToolSprint exists, how our browser-based tools keep your files private, and our commitment to accurate, genuinely useful free tools.",
  path: "/about/", absolute: true,
});

export default function About() {
  return (
    <InfoPage title="About ToolSprint" href="/about/" intro="ToolSprint is a collection of free, practical online tools for everyday tasks — built to be fast, honest about what it can do, and respectful of your privacy.">
      <h2>Why we built it</h2>
      <p>
        Many “free online tool” websites ask you to upload personal files to unknown servers, hide basic features behind sign-ups, or bury the tool under advertising. We wanted a single place where common tasks — shrinking a photo for an application form, merging PDFs, working out a GPA or checking a JSON file — simply work, without those trade-offs.
      </p>
      <h2>What you will find here</h2>
      <p>We currently offer {tools.length} tools across six categories:</p>
      <ul>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={categoryHref(c.slug)}>{c.name}</Link> — {c.short.toLowerCase()}.
          </li>
        ))}
      </ul>
      <p>Every tool page also explains how the tool works, gives worked examples, lists its limitations and answers common questions, so you understand the result you get.</p>
      <h2>How it works</h2>
      <p>
        ToolSprint is a static website. When you open a tool, the code needed to run it is downloaded to your browser and the processing happens on your own device. Image tools use the browser's Canvas engine, PDF tools use the open-source <a href="https://pdf-lib.js.org/" rel="noopener noreferrer" target="_blank">pdf-lib</a> and <a href="https://mozilla.github.io/pdf.js/" rel="noopener noreferrer" target="_blank">Mozilla PDF.js</a> libraries, and hashes use the Web Crypto API built into your browser.
      </p>
      <p>This means your photos, documents and text are not uploaded to us. It also means tools keep working quickly even on slower connections once the page has loaded.</p>
      <h2>Our commitments</h2>
      <ul>
        <li><strong>Accuracy:</strong> calculators show the formula they use, and their logic is covered by automated tests.</li>
        <li><strong>Honesty:</strong> if a tool cannot achieve something — such as compressing a PDF that is already efficient — it tells you instead of faking success.</li>
        <li><strong>Privacy:</strong> files are processed locally, and we never include your files or text in analytics.</li>
        <li><strong>Free access:</strong> tools work without an account. The site may display clearly labelled advertising to cover running costs.</li>
      </ul>
      <h2>Limitations</h2>
      <p>
        Browser-based processing depends on your device's memory, so very large files may be slow on older phones. Calculators provide estimates and educational explanations; they are not professional financial, tax or academic advice. See our <Link href="/disclaimer/">Disclaimer</Link> for details.
      </p>
      <h2>Get in touch</h2>
      <p>
        Found a bug, a wrong result or have an idea for a tool? Please <Link href="/contact/">contact us</Link> — feedback directly shapes what we fix and build next.
      </p>
    </InfoPage>
  );
}
