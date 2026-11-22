import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Limitations of FreeTools Hub calculators, file conversions and generated output, and why you should verify important results.",
  alternates: { canonical: "/disclaimer/" },
};

export default function Disclaimer() {
  return (
    <InfoPage title="Disclaimer" href="/disclaimer/" updated={site.lastUpdated} intro="Our tools are designed to be accurate and helpful, but every tool has limits. Please read this before relying on any result for an important decision.">
      <h2>Calculators</h2>
      <ul>
        <li><strong>Student calculators</strong> (GPA, CGPA, marks, grades, study hours) use the scales, weights and formulas you choose. Institutions apply their own rules for repeated courses, pass/fail grades, rounding and conversions. Your official transcript or institution is always authoritative.</li>
        <li><strong>Business calculators</strong> (margin, pricing, discount, markup, break-even, shipping, VAT) apply standard formulas to the numbers you enter. We do not provide live tax rates, exchange rates or carrier prices. Results are estimates and are not financial, accounting or tax advice. Consult a qualified professional for important decisions.</li>
        <li>Results are rounded for display. Small rounding differences compared with other software are normal.</li>
      </ul>
      <h2>File conversion and compression</h2>
      <ul>
        <li>Lossy formats such as JPG and WebP permanently discard some detail. Always keep your original files.</li>
        <li>Target-size compression aims to stay at or below your limit and reports the actual size. Some images cannot reach very small targets without reducing dimensions.</li>
        <li>PDF compression results depend entirely on the file's content. Some PDFs cannot be made smaller; image-based compression removes selectable text, links and form fields.</li>
        <li>Complex PDFs (encrypted files, unusual fonts, interactive forms) may not process or render perfectly. Check the output before sharing it.</li>
        <li>Processing happens in your browser, so very large files may fail on devices with limited memory.</li>
      </ul>
      <h2>Developer and SEO tools</h2>
      <ul>
        <li>Generated code, meta tags, robots.txt files and sitemaps should be reviewed before deployment.</li>
        <li>SEO tools create correctly formatted files from your input. They do not provide search volumes, rankings or backlink data, and no tool can guarantee search engine rankings or indexing.</li>
        <li>MD5 and SHA-1 are not suitable for security purposes; plain hashes should not be used to store passwords.</li>
      </ul>
      <h2>No warranty</h2>
      <p>All tools are provided “as is” without warranties of any kind, express or implied. You use them at your own risk and remain responsible for checking that results meet your needs.</p>
    </InfoPage>
  );
}
