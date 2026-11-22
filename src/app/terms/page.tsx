import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { site, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Terms of Service",
  description: "The terms for using ToolSprint: acceptable use, your responsibilities, intellectual property, availability and limitation of liability.",
  path: "/terms/",
});

export default function Terms() {
  return (
    <InfoPage title="Terms of Service" href="/terms/" updated={site.lastUpdated} intro="By using ToolSprint you agree to these terms. Please read them carefully.">
      <h2>1. The service</h2>
      <p>ToolSprint provides free, browser-based tools for working with images, PDFs, text and code, and calculators for study and business. Most processing takes place on your own device.</p>
      <h2>2. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the tools to process content you do not have the right to use, or to infringe copyright or other rights.</li>
        <li>Use the tools for any unlawful purpose, including fraud or forging documents.</li>
        <li>Attempt to disrupt, overload or gain unauthorised access to the website or its infrastructure, including through automated scraping at a rate that degrades the service.</li>
        <li>Use the contact form to send spam or abusive content.</li>
      </ul>
      <h2>3. Your content</h2>
      <p>You keep all rights to the files and text you process. Because processing happens in your browser, we do not receive or store this content. You are responsible for keeping backups of your original files.</p>
      <h2>4. Accuracy and no professional advice</h2>
      <p>
        We work hard to make every tool accurate, but outputs are provided for general information. Calculators do not constitute financial, tax, legal or academic advice. Always verify important results — for example official GPA, tax or shipping figures — with the relevant institution or authority. See the <Link href="/disclaimer/">Disclaimer</Link>.
      </p>
      <h2>5. Availability</h2>
      <p>The service is provided free of charge “as is” and “as available”. We may change, suspend or discontinue any tool at any time without notice, and we do not guarantee uninterrupted or error-free operation.</p>
      <h2>6. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, ToolSprint and its operators are not liable for any indirect, incidental or consequential loss, including loss of data, revenue or opportunity, arising from your use of the tools or reliance on their results. Nothing in these terms excludes liability that cannot be excluded by law.
      </p>
      <h2>7. Third-party services and links</h2>
      <p>The site may contain links to other websites and, where enabled, advertising and analytics provided by third parties. Their own terms and privacy policies apply, and we are not responsible for their content.</p>
      <h2>8. Intellectual property</h2>
      <p>The website design, text and original code are owned by the operators of ToolSprint. Open-source libraries we use are subject to their own licences.</p>
      <h2>9. Changes to these terms</h2>
      <p>We may update these terms. Continued use of the site after changes take effect means you accept the revised terms.</p>
      <h2>10. Contact</h2>
      <p>Questions about these terms can be sent via our <Link href="/contact/">contact page</Link>.</p>
    </InfoPage>
  );
}
