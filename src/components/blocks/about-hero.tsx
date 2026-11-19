import { DashedLine } from "@/components/dashed-line";
import { siteConfig } from "@/lib/site-config";

const facts = [
  { value: "Marketing", label: "Live in beta" },
  { value: "Sales + Support", label: "Coming soon" },
  { value: "Instagram + Messenger", label: "Channels in the beta" },
  { value: "Free", label: "During the beta" },
];

export function AboutHero() {
  return (
    <section className="">
      <div className="container flex max-w-5xl flex-col justify-between gap-8 md:gap-20 lg:flex-row lg:items-center lg:gap-24 xl:gap-24">
        <div className="flex-[1.5]">
          <h1 className="text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            You sleep. Sojao keeps your DMs working.
          </h1>

          <p className="text-muted-foreground mt-5 text-2xl md:text-3xl lg:text-4xl">
            “Sojao” means “go to sleep.” That&apos;s our promise to you.
          </p>

          <p className="text-muted-foreground mt-8 max-w-lg text-lg text-balance lg:mt-12">
            {siteConfig.brandName} is a product of {siteConfig.legalName}. We
            build it for small brands that sell on Instagram and Facebook
            Messenger.
          </p>
        </div>

        <div className="relative flex flex-1 flex-col justify-center gap-4 pt-10 lg:pt-0 lg:pl-10">
          <DashedLine orientation="vertical" className="absolute top-0 left-0 max-lg:hidden" />
          <DashedLine orientation="horizontal" className="absolute top-0 lg:hidden" />
          {facts.map((f) => (
            <div key={f.value} className="flex flex-col gap-1">
              <div className="font-display text-2xl tracking-wide md:text-3xl">{f.value}</div>
              <div className="text-muted-foreground">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
