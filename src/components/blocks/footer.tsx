import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const navigation = [
    { name: "Product", href: "/#feature-modern-teams" },
    { name: "About Us", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  // Only shown once real profile URLs are set (see .env.example).
  const social = [
    { name: "X", href: siteConfig.social.x },
    { name: "LinkedIn", href: siteConfig.social.linkedin },
  ].filter((item): item is { name: string; href: string } => !!item.href);

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="flex flex-col items-center gap-14 pt-28 lg:pt-32">
      <div className="container space-y-3 text-center">
        <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
          Sleep tight. Sojao&apos;s got the night shift.
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
          Bring customers in, sell to them and look after them on Instagram,
          Messenger and WhatsApp. 24/7, with zero flows to build.
        </p>
        <div>
          <Button size="lg" className="mt-4" asChild>
            <Link href="/signup">Join the beta</Link>
          </Button>
        </div>
      </div>

      <nav aria-label="Footer" className="container flex flex-col items-center gap-4">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="font-medium transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
          {social.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75"
              >
                {item.name} <ArrowUpRight className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {legal.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-muted-foreground text-sm transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="text-muted-foreground space-y-1 text-center text-sm">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. Sojao AI is a
            product of {siteConfig.legalName}.
          </p>
          <p>
            {siteConfig.contactEmail ? (
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="hover:text-foreground underline underline-offset-4"
              >
                {siteConfig.contactEmail}
              </a>
            ) : (
              <Link
                href="/contact"
                className="hover:text-foreground underline underline-offset-4"
              >
                Contact us
              </Link>
            )}
          </p>
        </div>
      </nav>

      <div className="mt-10 flex w-full justify-center overflow-hidden pt-[4vw] pb-4 md:mt-14 lg:mt-20">
        <Logo className="text-[18vw] opacity-90" />
      </div>
    </footer>
  );
}
