import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

/**
 * About: founder story. Only facts from the founder brief; no team photos
 * until real ones exist.
 */
const About = () => {
  return (
    <section className="container mt-14 grid max-w-5xl gap-12 md:mt-20 lg:mt-28 lg:grid-cols-2 lg:gap-16">
      <TextSection
        title="Why we're building Sojao"
        paragraphs={[
          `${siteConfig.brandName} was founded by ${siteConfig.founderName}, who is building it at ${siteConfig.legalName}.`,
          "The goal is simple: small brands should not lose sales at night. Most small brands answer their own DMs. When a customer comments, replies to a story or sends a message after hours, nobody is there to answer, and the moment is gone.",
          "Sojao answers for you. It starts with Marketing: it turns comments, story replies and DMs into leads, and helps you send the right message to the right people.",
        ]}
      />
      <TextSection
        title="Where we are today"
        paragraphs={[
          "Sojao is in beta. The Marketing module is live for Instagram and Messenger. Sales and Support are coming soon.",
          "We're opening Sojao to a small group of early brands first. Want in? Join the beta.",
        ]}
        ctaButton={{ href: "/signup", text: "Join the beta" }}
      />
    </section>
  );
};

export default About;

interface TextSectionProps {
  title?: string;
  paragraphs: string[];
  ctaButton?: {
    href: string;
    text: string;
  };
}

export function TextSection({ title, paragraphs, ctaButton }: TextSectionProps) {
  return (
    <section className="flex-1 space-y-4 text-lg md:space-y-6">
      {title && <h2 className="text-foreground text-3xl md:text-4xl">{title}</h2>}
      <div className="text-muted-foreground max-w-xl space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {ctaButton && (
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href={ctaButton.href}>{ctaButton.text}</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
