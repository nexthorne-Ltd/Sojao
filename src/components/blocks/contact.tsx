import { ContactForm } from "@/components/blocks/contact-form";
import { DashedLine } from "@/components/dashed-line";
import { siteConfig } from "@/lib/site-config";

export default function Contact() {
  const social = [
    { name: "X", href: siteConfig.social.x },
    { name: "LinkedIn", href: siteConfig.social.linkedin },
  ].filter((item): item is { name: string; href: string } => !!item.href);

  const contactInfo = [
    {
      title: "Company",
      content: (
        <p className="text-muted-foreground mt-3">
          {siteConfig.legalName}
          {siteConfig.address && (
            <>
              <br />
              {siteConfig.address}
            </>
          )}
        </p>
      ),
    },
    {
      title: "Email us",
      content: (
        <p className="text-muted-foreground mt-3">
          {siteConfig.contactEmail ? (
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="hover:text-foreground underline underline-offset-4"
            >
              {siteConfig.contactEmail}
            </a>
          ) : (
            "Use the form below."
          )}
        </p>
      ),
    },
    ...(social.length
      ? [
          {
            title: "Follow us",
            content: (
              <ul className="text-muted-foreground mt-3 flex gap-6">
                {social.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
  ];

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
          {contactInfo.map((info) => (
            <div key={info.title}>
              <h2 className="font-medium">{info.title}</h2>
              {info.content}
            </div>
          ))}
        </div>

        <DashedLine className="my-12" />

        <div className="mx-auto">
          <h2 className="mb-4 text-lg font-semibold">Send us a message</h2>
          <ContactForm fallbackEmail={siteConfig.contactEmail} />
        </div>
      </div>
    </section>
  );
}
