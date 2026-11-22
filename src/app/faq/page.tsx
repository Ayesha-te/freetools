import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import JsonLd from "@/components/JsonLd";
import FaqList from "@/components/FaqList";

export const metadata: Metadata = pageMeta({
  title: "Frequently Asked Questions",
  description: "Answers to common questions about ToolSprint: privacy, file limits, browser support, accuracy, costs and how to report problems.",
  path: "/faq/",
});

const faqs: { q: string; a: string; link?: [string, string] }[] = [
  { q: "Are the tools really free?", a: "Yes. Every tool is free to use with no account and no usage quota. The site may show clearly labelled ads to cover hosting costs." },
  { q: "Are my files uploaded to your servers?", a: "No. Image, PDF, text and developer tools run in your browser on your own device. Your files are not uploaded, stored or viewed by us." },
  { q: "Do the tools work offline?", a: "Once a tool page has fully loaded, most tools continue to work even if your connection drops, because processing is local. You need a connection to open new pages." },
  { q: "What is the maximum file size?", a: "Images up to 40 MB and PDFs up to 100 MB each. The real limit is your device's memory, so very large files may be slow on older phones." },
  { q: "Which browsers are supported?", a: "Current versions of Chrome, Edge, Firefox and Safari on desktop and mobile. Very old browsers may lack features such as the Web Crypto API." },
  { q: "How accurate are the calculators?", a: "They apply standard formulas, are covered by automated tests, and show their working. However, institutions and tax authorities have their own rules, so verify important results with them.", link: ["Read the disclaimer", "/disclaimer/"] },
  { q: "Why couldn't my image reach the target size?", a: "Very detailed images may not fit small targets even at low quality. The tool reduces dimensions automatically where possible and always tells you the real final size rather than faking success." },
  { q: "Why didn't my PDF get smaller?", a: "PDFs made from text are already compact. Lossless cleanup cannot shrink them much, and converting text pages to images usually makes them larger. Image-based compression works best for scanned documents." },
  { q: "How are favourites and recent tools saved?", a: "In your browser's local storage, on your device only. Clearing your browser data removes them. Nothing is linked to an account." },
  { q: "Do you use cookies?", a: "ToolSprint itself does not set tracking cookies. If analytics or advertising is enabled, those services may use cookies after you consent.", link: ["Privacy Policy", "/privacy-policy/"] },
  { q: "Can I suggest a new tool or report a bug?", a: "Please do. Use the contact page and include the tool name, what happened and your browser.", link: ["Contact us", "/contact/"] },
];

export default function Faq() {
  return (
    <InfoPage title="Frequently asked questions" href="/faq/" intro="Quick answers about privacy, limits and how ToolSprint works." ads>
      <FaqList
        items={faqs.map((f) => ({
          q: f.q,
          a: (
            <>
              {f.a}{" "}
              {f.link && (
                <Link href={f.link[1]} className="font-medium text-primary underline underline-offset-4">
                  {f.link[0]}
                </Link>
              )}
            </>
          ),
        }))}
      />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </InfoPage>
  );
}
