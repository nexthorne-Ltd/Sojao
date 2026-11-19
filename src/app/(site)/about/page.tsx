import { Background } from "@/components/background";
import About from "@/components/blocks/about";
import { AboutHero } from "@/components/blocks/about-hero";
import { Investors } from "@/components/blocks/investors";
import { DashedLine } from "@/components/dashed-line";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "About",
  description:
    `${siteConfig.brandName} is a product of ${siteConfig.legalName}, founded by ${siteConfig.founderName} so that small brands don't lose sales at night. Marketing is live in beta.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Background>
      <div className="py-28 lg:py-32 lg:pt-44">
        <AboutHero />

        <About />
        <div className="overflow-hidden pt-28 lg:pt-32">
          <DashedLine className="container max-w-5xl scale-x-115" />
          <Investors />
        </div>
      </div>
    </Background>
  );
}
