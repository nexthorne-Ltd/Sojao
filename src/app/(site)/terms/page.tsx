/*
 * DRAFT, NEEDS REVIEW BY A LAWYER BEFORE LAUNCH.
 * Terms of Service for Sojao AI (a product of Nexthorne).
 * Company details, governing law and dates come from src/lib/site-config.ts.
 */
import Link from "next/link";

import { CompanyDetails, ContactUs, LegalPage } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, value } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: `The terms for using ${siteConfig.brandName}, the AI marketing agent by ${siteConfig.legalName}, during the beta.`,
  path: "/terms",
});

export default function TermsPage() {
  const { legalName, brandName } = siteConfig;
  const law = value("governingLaw");

  return (
    <LegalPage
      title="Terms of Service"
      intro={
        <p>
          These terms are an agreement between you and {legalName} for the use of {brandName}.{" "}
          {brandName} is a product of {legalName}. By creating an account or using the service,
          you agree to these terms.
        </p>
      }
    >
      <h2>1. The service</h2>
      <p>
        {brandName} is an AI marketing agent for Instagram and Facebook Messenger. During the beta
        it offers the Marketing module: Comment-to-DM, story reply, mention, keyword and follow
        automations, lead capture, tags and segments, broadcasts, drip sequences, giveaways and
        growth tools. Sales, Support and WhatsApp features are not available yet.
      </p>

      <h2>2. Beta</h2>
      <p>
        The service is in beta. Features may change, be limited or be removed, and the service may
        have errors or interruptions. It is provided &quot;as is&quot; and &quot;as
        available&quot;. Please check important automations and messages before you rely on
        them.
      </p>

      <h2>3. Your account</h2>
      <p>
        You must be old enough to enter into a binding contract and able to act for the business
        you sign up for. Keep your login
        details safe and tell us about any unauthorised use. You are responsible for activity in
        your account.
      </p>

      <h2>4. Acceptable use</h2>
      <p>When you use {brandName}, you must:</p>
      <ul>
        <li>Follow Meta&apos;s Terms, the Meta Platform Terms, Instagram&apos;s Terms of Use and Community Guidelines, and Messenger&apos;s policies.</li>
        <li>Only message people in ways the platforms allow, including the 24-hour messaging window and sending limits.</li>
        <li>Not send spam, misleading messages or unsolicited bulk messages.</li>
        <li>Respect opt-outs: when a customer asks you to stop, stop sending them marketing messages.</li>
        <li>Not use the service for anything illegal, harmful, hateful, or that infringes someone else&apos;s rights.</li>
        <li>Not try to break, overload or reverse-engineer the service, or get around its limits.</li>
      </ul>

      <h2>5. Your responsibilities as a brand owner</h2>
      <ul>
        <li>You are responsible for the content of your automations, replies and broadcasts, and for the products and offers you promote.</li>
        <li>
          You are responsible for having a lawful basis to message your customers and to collect
          their details, and for your own privacy notice to them. {legalName} processes your
          customers&apos; data on your behalf, as described in our <Link href="/privacy">Privacy Policy</Link>.
        </li>
        <li>You must have the right to connect the Instagram accounts and Facebook Pages you connect.</li>
      </ul>

      <h2>6. AI-generated replies</h2>
      <p>
        {brandName} uses AI to write replies. AI can make mistakes. You can review your settings,
        pause Sojao at any time, and take over any conversation.
      </p>

      <h2>7. Fees</h2>
      <p>
        {brandName} is free during the beta. Nothing is charged during the beta. Pricing will be
        announced later.
      </p>

      <h2>8. Your content and data</h2>
      <p>
        You keep ownership of your content and your customers&apos; data. You give us permission
        to use it only to provide and improve the service for you. See the{" "}
        <Link href="/privacy">Privacy Policy</Link> and <Link href="/data-deletion">Data deletion</Link>.
      </p>

      <h2>9. Termination</h2>
      <p>
        You can stop using {brandName} and close your account at any time. We may suspend or end
        your access if you break these terms or the platforms&apos; rules, or if we stop the beta.
        Where possible we will tell you first. When an account is closed, we delete its data as
        described in our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>10. Liability</h2>
      <p>
        To the extent the law allows, {legalName} is not liable for indirect or consequential
        losses, such as lost sales, profits or data, arising from your use of the beta. Nothing in
        these terms limits liability that cannot be limited by law.
      </p>

      <h2>11. Changes to these terms</h2>
      <p>
        We may update these terms as the service changes. We will post the new version on this
        page, and tell you about important changes.
      </p>

      <h2>12. Governing law</h2>
      <p>
        {law
          ? `These terms are governed by ${law}.`
          : "These terms are governed by the laws of the country where the contracting " +
            `${legalName} entity is registered.`}
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these terms? <ContactUs kind="support" />.
      </p>
      <CompanyDetails />
    </LegalPage>
  );
}
