import Link from "next/link";

import { Background } from "@/components/background";
import { PageHeader } from "@/components/blocks/page-header";
import { PlatformRow, TrustIcon, trustPoints } from "@/components/blocks/trust";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, value } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Security",
  description:
    "How Sojao connects to Instagram and Messenger, follows Meta's messaging rules and keeps your data and your customers' data safe.",
  path: "/security",
});

const rules = [
  "One private reply per comment, sent within 7 days of the comment.",
  "Promotional messages only go to people who messaged you in the last 24 hours.",
  "Sending stays within Instagram's rate limits, so your account isn't flagged.",
  "Anyone who writes “stop” stops getting marketing messages.",
];

export default function SecurityPage() {
  const privacyEmail = value("privacyEmail") ?? value("supportEmail");

  return (
    <Background>
      <div className="pt-28 pb-28 lg:pt-44 lg:pb-32">
        <PageHeader
          eyebrow="Security"
          title="Safe for your account. Safe for your customers."
          description={`How ${siteConfig.brandName} connects to Meta and looks after the data it handles.`}
        />

        <div className="container max-w-5xl">
          <PlatformRow className="mb-10 justify-center" />
          <ul className="grid gap-4 sm:grid-cols-2">
            {trustPoints.map(({ title, text, logo }) => (
              <li key={title} className="bg-background/70 flex gap-4 rounded-3xl border p-6 backdrop-blur">
                <TrustIcon logo={logo} />
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-2">
            <section>
              <h2 className="text-2xl tracking-tight md:text-3xl">Meta&apos;s messaging rules</h2>
              <p className="text-muted-foreground mt-3">
                Every automation is built to stay inside Instagram and
                Messenger&apos;s rules, so your account stays in good standing.
              </p>
              <ul className="mt-6 space-y-3">
                {rules.map((r) => (
                  <li key={r} className="flex gap-3 text-sm">
                    <span className="bg-brand mt-1.5 size-1.5 shrink-0 rounded-full" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl tracking-tight md:text-3xl">Your data</h2>
              <p className="text-muted-foreground mt-3">
                {siteConfig.brandName} reads and replies to messages and comments
                only on your behalf, to run your automations. We don&apos;t sell
                data and don&apos;t use it for advertising.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <Link href="/privacy" className="text-brand font-medium hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  <span className="text-muted-foreground">: what we collect and why.</span>
                </li>
                <li>
                  <Link href="/data-deletion" className="text-brand font-medium hover:underline">
                    Data deletion
                  </Link>{" "}
                  <span className="text-muted-foreground">: how to remove your data.</span>
                </li>
                <li>
                  <Link href="/terms" className="text-brand font-medium hover:underline">
                    Terms of Service
                  </Link>
                </li>
              </ul>
              {privacyEmail && (
                <p className="text-muted-foreground mt-6 text-sm">
                  Found a security issue? Email{" "}
                  <a href={`mailto:${privacyEmail}`} className="text-foreground underline-offset-4 hover:underline">
                    {privacyEmail}
                  </a>
                  .
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </Background>
  );
}
