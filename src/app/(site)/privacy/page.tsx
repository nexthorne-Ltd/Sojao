/*
 * DRAFT, NEEDS REVIEW BY A LAWYER BEFORE LAUNCH.
 * Privacy Policy for Sojao AI (a product of Nexthorne).
 * Company details, retention period and dates come from src/lib/site-config.ts.
 */
import Link from "next/link";

import { CompanyDetails, ContactUs, LegalPage } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, value } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.legalName} collects, uses and protects data in ${siteConfig.brandName}, including messages from Instagram and Messenger.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  const { legalName, brandName } = siteConfig;
  const retention = value("retentionPeriod");

  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          This policy explains how {legalName} (&quot;we&quot;, &quot;us&quot;) handles personal
          data when you use {brandName}, our AI marketing agent for Instagram and Facebook
          Messenger, and our website. {brandName} is a product of {legalName}.
        </p>
      }
    >
      <h2>1. Who this policy covers</h2>
      <p>{brandName} involves two groups of people:</p>
      <ul>
        <li>
          <strong>Brand owners</strong>: businesses and the people who sign up for {brandName},
          connect their accounts and use the dashboard.
        </li>
        <li>
          <strong>The brand&apos;s customers</strong>: people who message, comment on, reply to a
          story of, or mention a brand that uses {brandName} on Instagram or Messenger (and, once
          available, WhatsApp). {brandName} reads these messages and comments and replies to them
          on the brand&apos;s behalf.
        </li>
      </ul>
      <p>
        For brand owners, {legalName} is the controller of your account data. For the
        brand&apos;s customers, the brand decides why and how their data is used, and{" "}
        {legalName} processes customer message data <strong>only on behalf of the brand</strong>{" "}
        and only to provide the service to that brand. If you are a customer of a brand, you can
        also contact the brand directly about your data.
      </p>

      <h2>2. Data we collect</h2>
      <h3>From brand owners</h3>
      <ul>
        <li>Account details: name, email address, login details and brand name.</li>
        <li>
          Connected channel identifiers, such as your Instagram account ID and Facebook Page ID,
          and the access tokens that let {brandName} act for those accounts. Access tokens are
          stored encrypted.
        </li>
        <li>
          Content you add: brand voice and tone settings, common questions and answers,
          automation settings, broadcast messages, tags and segments.
        </li>
        <li>Messages you send us, for example through the Contact form.</li>
      </ul>
      <h3>From the brand&apos;s customers (processed on behalf of the brand)</h3>
      <ul>
        <li>Message content of DMs sent to the brand, and replies sent by {brandName}.</li>
        <li>Comment text on the brand&apos;s posts, story replies and story mentions.</li>
        <li>Username, display name and the profile ID (page-scoped or Instagram-scoped ID) Meta provides.</li>
        <li>
          Lead details a customer chooses to share in a chat, such as name, email address, phone
          number and what they are interested in.
        </li>
        <li>Tags and segments the brand applies, and whether the customer has opted out of marketing messages.</li>
      </ul>
      <h3>Technical data and logs</h3>
      <ul>
        <li>
          Logs of automation runs and messages sent (time, type, delivery status) so we can
          operate the service, follow platform limits and fix problems.
        </li>
        <li>Basic technical data from website and dashboard visits, such as IP address, browser type and pages visited.</li>
      </ul>

      <h2>3. How we use data</h2>
      <ul>
        <li>To provide {brandName}: run the brand&apos;s automations, reply to comments and messages, capture leads, and send broadcasts the brand sets up.</li>
        <li>To generate replies with an AI model, using the brand&apos;s settings and the conversation.</li>
        <li>To follow platform rules, such as the 24-hour messaging window, sending limits and opt-outs.</li>
        <li>To keep the service secure, prevent abuse and fix problems.</li>
        <li>To support brand owners and answer messages sent to us.</li>
        <li>To meet legal obligations.</li>
      </ul>
      <p>
        We do not use the brand&apos;s customer data for our own marketing, and we do not sell
        personal data.
      </p>

      <h2>4. Data from Meta platforms</h2>
      <p>
        {brandName} connects to Instagram and Facebook Messenger through Meta&apos;s official
        APIs, only with the brand owner&apos;s permission. We use data received from Meta
        platforms only as allowed by the Meta Platform Terms and Developer Policies, and only to
        provide the features the brand has turned on. We do not sell data received from Meta
        platforms, and we do not use it for advertising or to build profiles for anyone other than
        the brand it belongs to. A brand owner can disconnect a channel at any time in Settings.
      </p>

      <h2>5. Sharing</h2>
      <p>We share personal data only with:</p>
      <ul>
        <li><strong>Hosting and infrastructure providers</strong> that store and run the service for us.</li>
        <li><strong>AI model providers</strong> that generate replies. They process the content only to return a reply to us.</li>
        <li><strong>Meta platforms</strong> (Instagram and Messenger), to receive and send messages and comments on the brand&apos;s behalf.</li>
        <li><strong>The brand</strong> the customer interacted with.</li>
        <li><strong>Authorities</strong>, where the law requires it.</li>
      </ul>
      <p>These providers may only use the data to provide their service to us.</p>

      <h2>6. Retention</h2>
      <p>
        We keep personal data only for as long as needed to provide the service to the brand, or
        as required by law.
        {retention && <> Specifically: {retention}.</>} A brand owner can delete customer data
        from the dashboard or ask us to delete it. See <Link href="/data-deletion">Data deletion</Link>.
      </p>

      <h2>7. Security</h2>
      <p>
        We use encryption in transit (HTTPS) and store channel access tokens encrypted. Access to
        personal data is limited to people and systems that need it to run the service.
      </p>

      <h2>8. Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, delete, or
        export your personal data, to object to or restrict how it is used, and to withdraw
        consent. Customers can stop marketing messages from a brand at any time by writing
        &quot;stop&quot; in the chat. To use any of these rights, <ContactUs />. You can also
        complain to your local data protection authority.
      </p>

      <h2>9. Children</h2>
      <p>
        {brandName} is not for children under 13, and brand owner accounts are for adults acting
        for a business. We do not knowingly collect data from children under 13. If you believe a
        child has given us personal data, <ContactUs /> and we will delete it.
      </p>

      <h2>10. International transfers</h2>
      <p>
        {legalName} operates in Pakistan and the United Kingdom, and our providers may process
        data in other countries. When data moves between countries we use appropriate
        safeguards, such as contractual protections with our providers.
      </p>

      <h2 id="cookies">11. Cookies and local storage</h2>
      <p>
        Our website uses only essential cookies and browser storage, for example to remember
        your theme or cookie choice and to keep you signed in. We do not use advertising or
        analytics cookies unless you allow them in the cookie notice.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update this policy as {brandName} changes, for example when new modules launch.
        We will post the new version on this page.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about this policy or your data? <ContactUs />.
      </p>
      <CompanyDetails />
    </LegalPage>
  );
}
