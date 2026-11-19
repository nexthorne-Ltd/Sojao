/*
 * DRAFT, NEEDS REVIEW BY A LAWYER BEFORE LAUNCH.
 * Data deletion instructions for Sojao AI. This URL is given to Meta as the
 * "Data deletion instructions URL" in the app settings.
 */
import Link from "next/link";

import { CompanyDetails, ContactUs, LegalPage } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, value } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Data deletion",
  description: `How brand owners and their customers can ask ${siteConfig.legalName} to delete their data from ${siteConfig.brandName}.`,
  path: "/data-deletion",
});

export default function DataDeletionPage() {
  const { legalName, brandName } = siteConfig;
  const time = value("deletionTime");
  const email = value("privacyEmail") ?? value("supportEmail");

  return (
    <LegalPage
      title="Data deletion"
      intro={
        <p>
          You can ask {legalName} to delete the data {brandName} holds about you at any time. This
          page explains how, for brand owners and for the customers who message those brands.
        </p>
      }
    >
      <h2>If you are a brand owner</h2>
      <ol>
        <li>
          To remove access, disconnect Instagram and Messenger in{" "}
          <strong>Dashboard → Settings → Channels</strong>. You can also remove {brandName} from
          the connected apps / business integrations list in your Facebook or Instagram account
          settings.
        </li>
        <li>
          To delete your account and all its data, <ContactUs /> from the email address on your
          account, with the subject &quot;Delete my data&quot; and the Instagram username or
          Facebook Page you connected.
        </li>
      </ol>

      <h2>If you messaged or commented on a brand that uses {brandName}</h2>
      <p>
        {email ? (
          <>
            Email <a href={`mailto:${email}`}>{email}</a>
          </>
        ) : (
          <>
            Contact us through our <Link href="/contact">Contact page</Link>
          </>
        )}{" "}
        with:
      </p>
      <ul>
        <li>your Instagram username (or the name on your Facebook profile for Messenger),</li>
        <li>the name or Instagram username of the brand you talked to,</li>
        <li>an email address where we can confirm the deletion.</li>
      </ul>
      <p>
        To stop marketing messages straight away, you can also write &quot;stop&quot; in the
        chat with the brand.
      </p>

      <h2>What we delete</h2>
      <ul>
        <li>Messages, comments, story replies and mentions we stored for the brand.</li>
        <li>Your username, profile ID, and any lead details you shared (name, email, phone, interest).</li>
        <li>Tags, segments and automation history linked to you.</li>
        <li>For brand owners: the account, connected channel identifiers and access tokens, settings and all customer data of that brand.</li>
      </ul>
      <p>
        We may keep a minimal record that a deletion request was handled, and anything we must
        keep by law. Copies held by Meta on Instagram or Messenger are controlled by Meta and the
        brand, not by us.
      </p>

      <h2>How long it takes</h2>
      <p>
        We confirm your request by email and delete the data
        {time ? <> within {time}</> : <> as soon as we have verified the request</>}. If we need
        more information to find your data, we will ask.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? <ContactUs />. More details are in our <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <CompanyDetails />
    </LegalPage>
  );
}
