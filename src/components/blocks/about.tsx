import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const About = () => {
  return (
    <section className="container mt-10 grid max-w-5xl gap-12 md:mt-14 lg:mt-20 lg:grid-cols-2 lg:gap-16">
      <TextSection
        title="Why we built Sojao"
        paragraphs={[
          "Today, small brands juggle three jobs in their DMs: marketing, sales and support. That usually means separate tools or extra people, three bills, three logins, and no single view of the customer.",
          "Sojao brings all three together in one AI agent with one customer memory. It answers questions from your store details, sends the checkout link right in the chat, and follows up when people go quiet. When it isn't sure, it hands the chat to you and learns from your reply.",
        ]}
      />

      <TextSection
        title="The team"
        paragraphs={[
          `Sojao AI is built by ${siteConfig.legalName}.`,
          "We keep things simple. Connect your accounts, add your store details, and go live. No flows. No tech skills needed.",
          "Sojao is in beta. We're opening it to a small group of early brands first. Want in? Join the beta.",
        ]}
        ctaButton={{
          href: "/signup",
          text: "Join the beta",
        }}
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
