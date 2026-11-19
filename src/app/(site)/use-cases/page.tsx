/* eslint-disable @next/next/no-img-element */
import { Background } from "@/components/background";
import { MiniChat, PageHero, SectionTitle, SplitRow } from "@/components/blocks/kit";
import { Reveal } from "@/components/reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Use cases",
  description:
    "How Instagram-first brands use Sojao: turn comments into leads, launch drops, run giveaways and win customers back.",
  path: "/use-cases",
});

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&h=500&q=75`;

const industries = [
  {
    name: "Fashion and accessories",
    text: "Drop links on reels, size questions answered by keyword, back-in-stock alerts when a size returns.",
    image: unsplash("photo-1441984904996-e0b6ba687e04"),
    alt: "Clothing boutique with hanging racks",
  },
  {
    name: "Beauty and skincare",
    text: "Product quizzes that recommend the right routine, and story replies that answer ingredient questions.",
    image: unsplash("photo-1608571423902-eed4a5ad8108"),
    alt: "Amber skincare dropper bottle on a wooden stand",
  },
  {
    name: "Instagram sellers",
    text: "One person, one phone. Sojao answers the repeat questions so you can pack orders.",
    image: unsplash("photo-1753164597612-5e71b83fda91"),
    alt: "Small business owner on the phone while working on a laptop",
  },
];

export default function UseCasesPage() {
  return (
    <Background>
      <PageHero
        eyebrow="Use cases"
        title="What brands do with Sojao."
        description="Four ways small teams turn Instagram conversations into sales, without being online all night."
        secondary={{ label: "Browse templates", href: "/templates" }}
      />

      <SplitRow
        id="leads"
        eyebrow="Turn comments into leads"
        title="Every comment can become an email."
        text="Ask people to comment a word on your reel. Sojao DMs them the link, asks for their email, and tags them by post."
        points={["Comment-to-DM on any post or reel", "Lead step with consent saved", "Tagged by the post they came from"]}
        cta={{ label: "Use the lead magnet template", href: "/templates#lead-magnet" }}
        visual={
          <MiniChat
            header={<span>Comment “GUIDE”</span>}
            messages={[
              { from: "bot", text: "Here's the free styling guide 📘 Want the next one by email?" },
              { from: "user", text: "maya@example.com" },
              { from: "bot", text: "Done! Tagged as Styling guide lead." },
            ]}
          />
        }
      />
      <SplitRow
        id="drops"
        reverse
        eyebrow="Launch a drop"
        title="Sell out the drop, not your evening."
        text="Collect early-access sign-ups before launch, send the link the moment it's live, and tell people when sizes come back."
        points={["Early-access list from comments and DMs", "Broadcast to the list inside the 24-hour window", "Back-in-stock alerts from your Shopify catalogue"]}
        cta={{ label: "Use the drop template", href: "/templates#drop" }}
        visual={
          <MiniChat
            header={<span>Broadcast · Early access</span>}
            messages={[{ from: "bot", text: "It's live ✨ You're on the early list, so here's your link before everyone else: yourbrand.shop/drop" }]}
          />
        }
      />
      <SplitRow
        id="giveaways"
        eyebrow="Run a giveaway"
        title="Giveaways that build your list."
        text="Collect entries from comments and DMs, keep them in one place, and message everyone who took part when you announce the winner."
        points={["Entries from comments and DMs", "Scheduled start and end", "Message every entrant afterwards"]}
        cta={{ label: "Use the giveaway template", href: "/templates#giveaway" }}
        visual={
          <MiniChat
            header={<span>Giveaway entry</span>}
            messages={[
              { from: "user", text: "WIN" },
              { from: "bot", text: "You're in 🎉 We'll message you on Friday with the winner." },
            ]}
          />
        }
      />
      <SplitRow
        id="winback"
        reverse
        eyebrow="Win customers back"
        title="Bring quiet customers back."
        text="Each night Sojao finds people who showed buying intent and went quiet, and drafts a message for you to approve. People Instagram no longer lets you message can be exported for your own ads."
        points={["You approve each batch first", "Drafts never invent a price", "Stops on reply or “stop”"]}
        cta={{ label: "Use the win-back template", href: "/templates#winback" }}
        visual={
          <MiniChat
            header={<span>Win-back · waiting for approval</span>}
            messages={[{ from: "bot", text: "Hi Aisha! The linen set you liked is back in your size. Want the link?" }]}
            note="Example draft. Nothing is sent until you approve."
          />
        }
      />

      <section id="industries" className="container max-w-6xl scroll-mt-32 py-14 lg:py-20">
        <SectionTitle eyebrow="By business" title="Made for Instagram-first brands." />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {industries.map((ind, i) => (
            <Reveal as="li" key={ind.name} delay={i * 0.08}>
              <div className="group bg-background/70 h-full overflow-hidden rounded-3xl border">
                <div className="aspect-[7/5] overflow-hidden">
                  <img src={ind.image} alt={ind.alt} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold">{ind.name}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{ind.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>
    </Background>
  );
}
