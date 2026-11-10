import type { Metadata } from "next";

import { Background } from "@/components/background";
import About from "@/components/blocks/about";
import { AboutHero } from "@/components/blocks/about-hero";
import { Investors } from "@/components/blocks/investors";
import { DashedLine } from "@/components/dashed-line";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Why we built Sojao AI and who it is for.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Background>
      <div className="py-28 lg:py-32 lg:pt-44">
        <AboutHero />

        <About />
        <div className="pt-28 lg:pt-32">
          <DashedLine className="container max-w-5xl md:scale-x-115" />
          <Investors />
        </div>
      </div>
    </Background>
  );
}
