import React from "react";

import { ContactForm } from "@/components/blocks/contact-form";
import { DashedLine } from "@/components/dashed-line";
import { isSet, siteConfig, value } from "@/lib/site-config";

/**
 * Contact page. Company details come from lib/site-config.ts. Any value
 * that is still a [PLACEHOLDER] is hidden instead of shown to visitors.
 */
export default function Contact() {
  const address = value("address");
  const country = value("country");
  const phone = value("phone");
  const supportEmail = value("supportEmail");
  const privacyEmail = value("privacyEmail");
  const social = [
    { name: "Instagram", href: siteConfig.social.instagram },
    { name: "LinkedIn", href: siteConfig.social.linkedin },
    { name: "X", href: siteConfig.social.x },
  ].filter((s) => isSet(s.href));

  const blocks: { title: string; content: React.ReactNode }[] = [
    {
      title: "Company",
      content: (
        <address className="text-muted-foreground mt-3 not-italic">
          {siteConfig.legalName}
          <br />
          <span className="text-sm">
            {siteConfig.brandName} is a product of {siteConfig.legalName}.
          </span>
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
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                {phone}
              </a>
            </>
          )}
        </address>
      ),
    },
  ];

  if (supportEmail || privacyEmail) {
    blocks.push({
      title: "Email us",
      content: (
        <div className="mt-3 space-y-2">
          {supportEmail && (
            <div>
              <p>Support</p>
              <a href={`mailto:${supportEmail}`} className="text-muted-foreground hover:text-foreground break-all">
                {supportEmail}
              </a>
            </div>
          )}
          {privacyEmail && (
            <div>
              <p>Privacy and data requests</p>
              <a href={`mailto:${privacyEmail}`} className="text-muted-foreground hover:text-foreground break-all">
                {privacyEmail}
              </a>
            </div>
          )}
        </div>
      ),
    });
  }

  if (social.length) {
    blocks.push({
      title: "Follow us",
      content: (
        <ul className="mt-3 space-y-1">
          {social.map((s) => (
            <li key={s.name}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      ),
    });
  }

  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container max-w-2xl">
        <h1 className="text-center text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          Talk to us
        </h1>
        <p className="text-muted-foreground mt-4 text-center leading-snug font-medium lg:mx-auto">
          Questions about Sojao or the beta? Send us a note and a real person
          will get back to you.
        </p>

        <div className="mt-10 flex justify-between gap-8 max-sm:flex-col md:mt-14 lg:mt-20 lg:gap-12">
          {blocks.map((info) => (
            <div key={info.title}>
              <h2 className="font-medium">{info.title}</h2>
              {info.content}
            </div>
          ))}
        </div>

        <DashedLine className="my-12" />

        {/* Inquiry Form */}
        <div className="mx-auto">
          <h2 className="mb-4 text-lg font-semibold">Send us a message</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
