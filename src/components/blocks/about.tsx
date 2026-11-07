import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const About = () => {
  return (
    <section className="container mt-10 flex max-w-5xl flex-col-reverse gap-8 md:mt-14 md:gap-14 lg:mt-20 lg:flex-row lg:items-end">
      {/* Images Left - Text Right */}
      <div className="flex flex-col gap-8 lg:gap-16 xl:gap-20">
        <ImageSection
          images={[
            { src: "/about/1.webp", alt: "[Team photo]" },
            { src: "/about/2.webp", alt: "[Team photo]" },
          ]}
          className="xl:-translate-x-10"
        />

        <TextSection
          title="The team"
          paragraphs={[
            "Sojao AI is built by Nexthorne. [Short founder story: who you are and why you started Sojao.]",
            "We keep things simple. Connect your accounts, connect your store, and go live in about 10 minutes. No flows. No tech skills needed.",
            "We're opening Sojao to a small group of early brands first. Want in? Join the beta.",
          ]}
          ctaButton={{
            href: "/signup",
            text: "Join the beta",
          }}
        />
      </div>

      {/* Text Left - Images Right */}
      <div className="flex flex-col gap-8 lg:gap-16 xl:gap-20">
        <TextSection
          paragraphs={[
            "Today, small brands pay for three tools: ManyChat for marketing, a VA for sales, and a helpdesk for support. That's three bills, three logins, and no single view of the customer.",
            "Sojao replaces all three with one AI agent and one customer memory. It answers every question from your real store data, sends the checkout link right in the chat, and follows up when people go quiet. When it isn't sure, it hands the chat to you and learns from your reply.",
          ]}
        />
        <ImageSection
          images={[
            { src: "/about/3.webp", alt: "[Team photo]" },
            { src: "/about/4.webp", alt: "[Team photo]" },
          ]}
          className="hidden lg:flex xl:translate-x-10"
        />
      </div>
    </section>
  );
};

export default About;

interface ImageSectionProps {
  images: { src: string; alt: string }[];
  className?: string;
}

export function ImageSection({ images, className }: ImageSectionProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-[2/1.5] overflow-hidden rounded-2xl"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

interface TextSectionProps {
  title?: string;
  paragraphs: string[];
  ctaButton?: {
    href: string;
    text: string;
  };
}

export function TextSection({
  title,
  paragraphs,
  ctaButton,
}: TextSectionProps) {
  return (
    <section className="flex-1 space-y-4 text-lg md:space-y-6">
      {title && <h2 className="text-foreground text-4xl">{title}</h2>}
      <div className="text-muted-foreground max-w-xl space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {ctaButton && (
        <div className="mt-8">
          <Link href={ctaButton.href}>
            <Button size="lg">{ctaButton.text}</Button>
          </Link>
        </div>
      )}
    </section>
  );
}
