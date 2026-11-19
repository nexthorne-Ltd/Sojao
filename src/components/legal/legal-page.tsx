import Link from "next/link";

import { siteConfig, value } from "@/lib/site-config";

/** Shared layout for Privacy, Terms and Data deletion. */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  const updated = value("lastUpdated");
  return (
    <section className="container max-w-3xl py-28 lg:pt-44 lg:pb-32">
      <article className="prose prose-lg dark:prose-invert prose-headings:tracking-tight prose-a:underline-offset-4 max-w-none">
        <h1>{title}</h1>
        {updated && <p className="text-muted-foreground text-sm">Last updated: {updated}</p>}
        {intro}
        {children}
      </article>
    </section>
  );
}

/** "email us at X" when the email is set, otherwise a link to the Contact page. */
export function ContactUs({ kind = "privacy" }: { kind?: "privacy" | "support" }) {
  const email = value(kind === "privacy" ? "privacyEmail" : "supportEmail") ?? value("supportEmail");
  return email ? (
    <>
      email us at <a href={`mailto:${email}`}>{email}</a>
    </>
  ) : (
    <>
      contact us through our <Link href="/contact">Contact page</Link>
    </>
  );
}

/** Company identity block used at the end of each legal page. */
export function CompanyDetails() {
  const address = value("address");
  const country = value("country");
  const phone = value("phone");
  const privacyEmail = value("privacyEmail");
  const supportEmail = value("supportEmail");
  return (
    <address className="not-italic">
      <strong>{siteConfig.legalName}</strong> ({siteConfig.brandName} is a product of{" "}
      {siteConfig.legalName})
      {address && (
        <>
          <br />
          {address}
        </>
      )}
      {country && !address?.includes(country) && (
        <>
          <br />
          {country}
        </>
      )}
      {phone && (
        <>
          <br />
          Phone: {phone}
        </>
      )}
      {privacyEmail && (
        <>
          <br />
          Privacy: <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>
        </>
      )}
      {supportEmail && (
        <>
          <br />
          Support: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
        </>
      )}
      {!privacyEmail && !supportEmail && (
        <>
          <br />
          <Link href="/contact">Contact page</Link>
        </>
      )}
    </address>
  );
}
