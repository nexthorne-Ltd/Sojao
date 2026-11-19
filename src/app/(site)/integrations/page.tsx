import { Code2, Download, Link2, Megaphone, QrCode, Store } from "lucide-react";
import { FaFacebookMessenger, FaInstagram, FaShopify, FaWhatsapp } from "react-icons/fa";

import { Background } from "@/components/background";
import { PageHero, SectionTitle } from "@/components/blocks/kit";
import { Reveal } from "@/components/reveal";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Integrations",
  description:
    "Connect Sojao to Instagram, your Shopify store, your website and your marketing tools. See what's live and what's coming.",
  path: "/integrations",
});

type Item = {
  name: string;
  text: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  bg?: string;
  status: "live" | "soon";
};

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Channels",
    items: [
      {
        name: "Instagram",
        text: "Comments, story replies, mentions and DMs through Meta's official login.",
        icon: FaInstagram,
        bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
        status: "live",
      },
      {
        name: "Messenger",
        text: "Facebook Page conversations.",
        icon: FaFacebookMessenger,
        bg: "linear-gradient(45deg, #0099FF 0%, #A033FF 60%, #FF5280 90%, #FF7061 100%)",
        status: "soon",
      },
      { name: "WhatsApp", text: "On the roadmap.", icon: FaWhatsapp, bg: "#25D366", status: "soon" },
    ],
  },
  {
    title: "Store",
    items: [
      {
        name: "Shopify",
        text: "Sync your catalogue for product answers, quizzes, back-in-stock alerts and discount codes.",
        icon: FaShopify,
        bg: "#95BF47",
        status: "live",
      },
      { name: "Manual catalogue", text: "No Shopify? Add products by hand in the dashboard.", icon: Store, status: "live" },
    ],
  },
  {
    title: "Growth tools",
    items: [
      { name: "Website chat widget", text: "One script tag starts Instagram conversations from your site.", icon: Code2, status: "live" },
      { name: "Tracked links", text: "ig.me links that tag where each conversation came from.", icon: Link2, status: "live" },
      { name: "QR codes", text: "Print a code for packaging or events that opens a chat.", icon: QrCode, status: "live" },
      { name: "Ad referrals", text: "See which Click-to-Instagram ads start conversations.", icon: Megaphone, status: "live" },
      { name: "CSV export", text: "Download leads for your email or SMS tool.", icon: Download, status: "live" },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <Background>
      <PageHero
        eyebrow="Integrations"
        title="Plug Sojao into the tools you already use."
        description="Connect your channels, your store and your website. Everything marked live works in the beta today."
        primary={{ label: "Join the beta", href: "/signup" }}
        secondary={{ label: "See the roadmap", href: "/roadmap" }}
      />
      <div className="container max-w-6xl space-y-16 pb-10">
        {groups.map((g) => (
          <section key={g.title}>
            <SectionTitle title={g.title} className="max-w-none text-left [&_h2]:text-2xl md:[&_h2]:text-3xl" />
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map(({ name, text, icon: Icon, bg, status }, i) => (
                <Reveal as="li" key={name} delay={(i % 3) * 0.08}>
                  <div className="bg-background/70 hover:border-brand/40 flex h-full gap-4 rounded-3xl border p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <span
                      className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", bg ? "text-white" : "bg-brand/12 text-brand")}
                      style={bg ? { background: bg } : undefined}
                    >
                      <Icon className="size-6" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{name}</h3>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                            status === "live" ? "bg-brand/12 text-brand" : "text-muted-foreground border",
                          )}
                        >
                          {status === "live" ? "Live" : "Coming soon"}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Background>
  );
}
