import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import JsonLd from "@/components/JsonLd";
import ContactForm from "@/components/ContactForm";
import { site, pageMeta, absUrl } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Contact Us – Report a Bug or Suggest a Tool",
  description: "Contact the ToolSprint team to report a problem, suggest a new tool or ask a question about privacy or advertising.",
  path: "/contact/",
});

export default function Contact() {
  return (
    <InfoPage title="Contact us" href="/contact/" intro="We read every message. Bug reports, incorrect results, accessibility problems and tool ideas are especially welcome.">
      {site.contactEmail ? (
        <>
          <h2>Email</h2>
          <p>
            Write to <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. We aim to reply within a few working days.
          </p>
        </>
      ) : (
        <p>
          <em>Contact email not yet configured.</em> (Site owner: set <code>NEXT_PUBLIC_CONTACT_EMAIL</code> before going live — see DEPLOYMENT.md.)
        </p>
      )}
      {site.apiUrl && (
        <>
          <h2>Send a message</h2>
          <ContactForm apiUrl={site.apiUrl} />
        </>
      )}
      <h2>Reporting a problem</h2>
      <p>To help us fix issues quickly, please include:</p>
      <ul>
        <li>The tool's name or page address.</li>
        <li>What you expected and what happened instead.</li>
        <li>Your browser and device (for example “Chrome on Android”).</li>
      </ul>
      <p>Please do not send us the private files or text you were processing. Describe the problem, or share a non-sensitive sample instead.</p>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact ToolSprint",
          url: absUrl("/contact/"),
          inLanguage: "en",
          isPartOf: { "@id": absUrl("/") + "#website" },
          about: { "@id": absUrl("/") + "#organization" },
        }}
      />
    </InfoPage>
  );
}
