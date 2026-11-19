import Link from "next/link";

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { isSet, siteConfig, value } from "@/lib/site-config";
import { FOOTER_COLUMNS } from "@/lib/site-nav";

export function Footer() {
  // Only real profile URLs from the site config are shown.
  const social = [
    { name: "Instagram", href: siteConfig.social.instagram },
    { name: "LinkedIn", href: siteConfig.social.linkedin },
    { name: "X", href: siteConfig.social.x },
  ].filter((s) => isSet(s.href));

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Data deletion", href: "/data-deletion" },
  ];

  const address = value("address");
  const supportEmail = value("supportEmail");
  const phone = value("phone");

  return (
    <footer className="flex flex-col items-center gap-16 pt-28 lg:pt-32">
      {/* CTA */}
      <Reveal className="container">
        <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-[2rem] px-6 py-14 text-center md:px-12 md:py-20">
          <div className="bg-brand/40 pointer-events-none absolute -top-24 left-1/2 h-64 w-2/3 -translate-x-1/2 rounded-full blur-3xl" />
          <h2 className="relative text-3xl tracking-tight text-balance md:text-5xl">
            Stop losing sales while you sleep.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl leading-snug text-balance opacity-80">
            Comment-to-DM, story replies, lead capture and broadcasts on Instagram, day and night.
            Free during the beta.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="secondary" className="group rounded-full" asChild>
              <Link href="/signup">
                Join the beta
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="hover:bg-primary-foreground/10 rounded-full" asChild>
              <Link href="/templates">Browse templates</Link>
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Columns */}
      <div className="container grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="space-y-4">
          <Logo className="text-[28px]" />
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            {siteConfig.brandName} is the AI marketing agent for Instagram-first brands. A product of{" "}
            {siteConfig.legalName}.
          </p>
          {social.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {social.map((item) => (
                <li key={item.name}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-sm font-medium hover:opacity-75">
                    {item.name} <ArrowUpRight className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.label} aria-label={col.label}>
            <p className="text-sm font-semibold">{col.label}</p>
            <ul className="mt-3 space-y-1">
              {col.links.map((l) => (
                <li key={l.title}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground hover:text-foreground inline-flex min-h-8 items-center gap-2 text-sm transition-colors"
                  >
                    {l.title}
                    {l.badge && (
                      <span className="rounded-full border px-1.5 text-[10px] font-semibold uppercase">{l.badge}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="container">
        <div className="text-muted-foreground flex flex-col gap-4 border-t pt-6 text-sm md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p>
              © {siteConfig.copyrightYear} {siteConfig.legalName}. {siteConfig.brandName} is a product of{" "}
              {siteConfig.legalName}.
            </p>
            {address && <p>{address}</p>}
            {(supportEmail || phone) && (
              <p className="flex flex-wrap gap-x-4">
                {supportEmail && (
                  <a href={`mailto:${supportEmail}`} className="hover:text-foreground underline-offset-4 hover:underline">
                    {supportEmail}
                  </a>
                )}
                {phone && (
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-foreground underline-offset-4 hover:underline">
                    {phone}
                  </a>
                )}
              </p>
            )}
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {legal.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex w-full justify-center overflow-hidden pt-[2vw] pb-4">
        <Logo className="text-[18vw] opacity-90" />
      </div>
    </footer>
  );
}
