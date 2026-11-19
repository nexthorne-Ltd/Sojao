import { Check, X } from "lucide-react";

const rows = [
  {
    without: "DMs from last night wait until you wake up",
    with: "Every comment and DM gets a reply in seconds",
  },
  {
    without: "You copy-paste the same link a hundred times",
    with: "One automation sends it to everyone who asks",
  },
  {
    without: "Emails and numbers get lost in old chats",
    with: "Leads land in one list you can export as CSV",
  },
  {
    without: "Promos go out to everyone, or no one",
    with: "Broadcasts go to the right tag or segment",
  },
  {
    without: "Hiring someone to watch your inbox at night",
    with: "Free during the beta",
  },
];

export const Comparison = () => {
  return (
    <section id="comparison" className="pb-28 lg:pb-32">
      <div className="container max-w-5xl">
        <h2 className="text-center text-3xl tracking-tight text-balance md:text-4xl lg:text-5xl">
          Your inbox, before and after.
        </h2>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
          <div className="bg-background/60 rounded-3xl border p-6 md:p-8">
            <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Without Sojao
            </p>
            <ul className="mt-6 space-y-4">
              {rows.map((r) => (
                <li key={r.without} className="text-muted-foreground flex gap-3">
                  <span className="bg-muted flex size-6 shrink-0 items-center justify-center rounded-full border">
                    <X className="size-3.5" />
                  </span>
                  {r.without}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl p-6 shadow-xl md:p-8">
            <div className="bg-brand/40 pointer-events-none absolute -top-16 -right-16 size-56 rounded-full blur-3xl" />
            <p className="relative text-sm font-semibold tracking-wide uppercase opacity-80">
              With Sojao
            </p>
            <ul className="relative mt-6 space-y-4">
              {rows.map((r) => (
                <li key={r.with} className="flex gap-3 font-medium">
                  <span className="bg-brand flex size-6 shrink-0 items-center justify-center rounded-full text-white">
                    <Check className="size-3.5" />
                  </span>
                  {r.with}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
