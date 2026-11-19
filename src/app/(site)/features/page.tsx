import Link from "next/link";

import {
  AtSign,
  Download,
  Gift,
  KeyRound,
  ListOrdered,
  MessageCircle,
  Reply,
  Send,
  Tag,
} from "lucide-react";

import { Background } from "@/components/background";
import { ChatDemo } from "@/components/blocks/chat-demo";
import { HowItWorks } from "@/components/blocks/how-it-works";
import { PageHeader } from "@/components/blocks/page-header";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Features",
  description:
    "Everything Sojao Marketing does today on Instagram and Messenger: Comment-to-DM, story replies, keywords, lead capture, broadcasts, drip sequences and giveaways.",
  path: "/features",
});

const groups = [
  {
    title: "Start conversations",
    items: [
      {
        icon: MessageCircle,
        name: "Comment-to-DM",
        text: "Someone comments a word you pick on a post or reel. Sojao sends them a private DM with your link.",
      },
      {
        icon: Reply,
        name: "Story replies",
        text: "Answer everyone who replies to your story, with a message that fits the story.",
      },
      {
        icon: AtSign,
        name: "Mentions",
        text: "Thank people who mention you in their story and start a conversation.",
      },
      {
        icon: KeyRound,
        name: "Keywords in DMs",
        text: "When a DM contains a word like “price” or “size”, Sojao sends the right answer.",
      },
    ],
  },
  {
    title: "Capture and organise leads",
    items: [
      {
        icon: ListOrdered,
        name: "Lead capture",
        text: "Ask for an email or phone number inside any automation. Answers are checked and saved.",
      },
      {
        icon: Tag,
        name: "Tags and segments",
        text: "Tag customers automatically by post, keyword or answer, and group them into segments.",
      },
      {
        icon: Download,
        name: "CSV export",
        text: "Download your leads any time and take them to your email or SMS tool.",
      },
    ],
  },
  {
    title: "Bring them back",
    items: [
      {
        icon: Send,
        name: "Broadcasts",
        text: "Send a promo to one tag or segment. Only people inside Meta's 24-hour window get it.",
      },
      {
        icon: ListOrdered,
        name: "Drip sequences",
        text: "A short series of follow-up messages, spaced out, that stops as soon as someone replies.",
      },
      {
        icon: Gift,
        name: "Giveaways",
        text: "Collect entries from comments and DMs, then message everyone who took part.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <Background>
      <div className="pt-28 lg:pt-44">
        <PageHeader
          eyebrow="Sojao Marketing · live in beta"
          title="Everything that runs while you sleep."
          description="The automations you can switch on today, on Instagram and Facebook Messenger."
        />

        <div className="container max-w-5xl space-y-16 pb-28 lg:space-y-20 lg:pb-32">
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="text-2xl tracking-tight md:text-3xl">{g.title}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map(({ icon: Icon, name, text }) => (
                  <li key={name} className="bg-background/70 rounded-3xl border p-6 backdrop-blur">
                    <span className="bg-brand/12 text-brand flex size-10 items-center justify-center rounded-xl">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-semibold">{name}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <HowItWorks />
        <ChatDemo />

        <section className="container max-w-3xl pb-28 text-center lg:pb-32">
          <h2 className="text-3xl tracking-tight md:text-4xl">
            Sales and Support are next.
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
            Selling in the chat and looking after customers after the sale are
            coming soon. See what we&apos;re building.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/signup">Join the beta</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/roadmap">See the roadmap</Link>
            </Button>
          </div>
        </section>
      </div>
    </Background>
  );
}
