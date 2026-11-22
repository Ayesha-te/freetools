import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { ads, site, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description: "How ToolSprint handles your data: local file processing, browser storage, optional analytics, advertising cookies and your choices.",
  path: "/privacy-policy/",
});

export default function Privacy() {
  const analytics = !!site.gaId;
  return (
    <InfoPage title="Privacy Policy" href="/privacy-policy/" updated={site.lastUpdated} intro="This policy explains what information is and is not collected when you use ToolSprint, and the choices you have.">
      <h2>1. Files and text you process</h2>
      <p>
        Our image, PDF, text, developer and calculator tools run inside your web browser. When you select a file or type text, it is processed on your own device. <strong>We do not upload, store or view your files, the text you enter, or the results produced.</strong> That data is discarded when you close or reload the page.
      </p>
      <p>
        The only exception is the optional contact form (if shown on the Contact page), which sends the name, email address and message you type to our server so we can reply.
      </p>
      <h2>2. Information stored in your browser</h2>
      <p>We use your browser's local storage — not cookies — to remember:</p>
      <ul>
        <li>Tools you mark as favourites and tools you used recently.</li>
        <li>Your light/dark theme preference.</li>
        <li>Your cookie consent choice.</li>
      </ul>
      <p>This information stays on your device, is never sent to us, and can be removed at any time by clearing your browser's site data.</p>
      <h2>3. Server and hosting logs</h2>
      <p>
        Like any website, our hosting provider automatically processes technical data such as IP address, browser type and requested pages in order to deliver the site and protect it against abuse. These logs do not contain your files or tool input.
      </p>
      <h2>4. Analytics</h2>
      {analytics ? (
        <p>
          With your consent, we use Google Analytics 4 to understand aggregate usage, such as which tools are popular and whether tools complete successfully. We send only event names and the tool's identifier — never file contents, file names, text you enter or results. IP anonymisation is requested. Google's use of this data is described in{" "}
          <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer" target="_blank">How Google uses information from sites that use its services</a>.
        </p>
      ) : (
        <p>Analytics is currently not enabled on this site. If we enable it in future, it will load only after you consent, and this section will be updated.</p>
      )}
      <h2>5. Advertising</h2>
      {ads.enabled ? (
        <>
          <p>
            We display advertisements served by Google AdSense. Google and its partners use cookies and similar technologies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.
          </p>
          <p>
            You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" rel="noopener noreferrer" target="_blank">Google Ads Settings</a>, or opt out of some third-party vendors' use of cookies for personalised advertising at <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer" target="_blank">www.aboutads.info</a>. If you reject non-essential cookies in our banner, we request non-personalised ads.
          </p>
        </>
      ) : (
        <p>
          Advertising is not currently displayed. We plan to show ads through Google AdSense in future. Before doing so we will update this policy to explain how Google and its partners use cookies to serve ads, and how to opt out of personalised advertising.
        </p>
      )}
      <h2>6. Cookies and consent</h2>
      <p>
        ToolSprint itself does not set tracking cookies. Third-party cookies are only used by analytics or advertising services when these are enabled, and you are asked for consent first. You can change your choice at any time with the “Cookie settings” link in the footer (shown when these services are enabled), or by clearing this site’s data in your browser.
      </p>
      <h2>7. Children</h2>
      <p>Our tools are suitable for general audiences, including students. We do not knowingly collect personal information from children.</p>
      <h2>8. Your rights</h2>
      <p>
        Depending on where you live (for example under the GDPR or CCPA), you may have rights to access, correct or delete personal data we hold. Because we do not collect your files or tool input, the only personal data we may hold is what you send through the contact form or by email. To exercise your rights, <Link href="/contact/">contact us</Link>.
      </p>
      <h2>9. Changes</h2>
      <p>We will update this page when our practices change, and revise the “Last updated” date above.</p>
    </InfoPage>
  );
}
