import { DashedLine } from "@/components/dashed-line";

const stats = [
  {
    value: "24/7",
    label: "Every DM answered",
  },
  {
    value: "3 in 1",
    label: "Marketing, sales and support",
  },
  {
    value: "10 min",
    label: "To set up",
  },
  {
    value: "0",
    label: "Flows to build",
  },
];

export function AboutHero() {
  return (
    <section className="">
      <div className="container flex max-w-5xl flex-col justify-between gap-8 md:gap-20 lg:flex-row lg:items-center lg:gap-24 xl:gap-24">
        <div className="flex-[1.5]">
          <h1 className="text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            You sleep. We handle your business.
          </h1>

          <p className="text-muted-foreground mt-5 text-2xl md:text-3xl lg:text-4xl">
            “Sojao” means “go to sleep.” That&apos;s our promise to you.
          </p>

          <p className="text-muted-foreground mt-8 hidden max-w-lg space-y-6 text-lg text-balance md:block lg:mt-12">
            Sojao AI is a product of Nexthorne. We build it for small brands
            that sell on Instagram, Facebook Messenger and WhatsApp.
            <br />
            <br />
            Most owners answer DMs themselves. They get the same questions every
            day, and they lose sales at night. Sojao fixes that. It brings
            customers in, sells to them, and looks after them after the sale, so
            you can finally switch off.
          </p>
        </div>

        <div
          className={`relative flex flex-1 flex-col justify-center gap-3 pt-10 lg:pt-0 lg:pl-10`}
        >
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="font-display text-4xl tracking-wide md:text-5xl">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
