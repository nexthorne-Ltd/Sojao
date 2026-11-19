import Link from "next/link";

import { Background } from "@/components/background";
import { PageHero } from "@/components/blocks/kit";
import { Reveal } from "@/components/reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Guides",
  description:
    "Step-by-step guides for Sojao: connect Instagram, set up Comment-to-DM, capture leads, send broadcasts inside Meta's 24-hour window, and train the AI.",
  path: "/guides",
});

const guides: { id: string; title: string; minutes: number; steps: string[]; tip?: string }[] = [
  {
    id: "connect",
    title: "Connect your Instagram account",
    minutes: 2,
    steps: [
      "Make sure your Instagram is a professional account (business or creator).",
      "In Sojao, open Settings → Channels and choose Connect Instagram.",
      "Log in on Instagram and approve access to messages and comments.",
      "Back in Sojao, your account shows as Connected.",
    ],
    tip: "Sojao never asks for your Instagram password. You can disconnect any time in Settings.",
  },
  {
    id: "comment-to-dm",
    title: "Set up Comment-to-DM",
    minutes: 4,
    steps: [
      "Go to Marketing → Automations → New automation and pick Comment-to-DM.",
      "Choose all posts or specific posts, and the word people should comment.",
      "Write the first private message. Keep it short and friendly.",
      "Pick “Ask first, send the link after they respond”, then add your link.",
      "Save. It's on straight away.",
    ],
    tip: "Asking first means their reply opens the 24-hour window, so you can send the link and follow up.",
  },
  {
    id: "lead-capture",
    title: "Capture emails and phone numbers",
    minutes: 3,
    steps: [
      "Open any automation and expand More options.",
      "Switch on “Then ask for name, email and phone”.",
      "Check the consent text. It's shown before the first question and saved with the lead.",
      "Find leads under Marketing → Leads and export them as CSV.",
    ],
  },
  {
    id: "24-hour-window",
    title: "Understand Meta's 24-hour window",
    minutes: 3,
    steps: [
      "You can message someone freely for 24 hours after their last message to you.",
      "After that, promotional messages aren't allowed, so Sojao won't send them.",
      "Broadcasts and drip steps only go to people inside the window.",
      "Anyone who writes “stop” stops getting marketing messages.",
    ],
    tip: "Comment-to-DM gives you one private reply per comment. Getting them to reply opens the window.",
  },
  {
    id: "train-ai",
    title: "Train the AI on your brand",
    minutes: 5,
    steps: [
      "Open Settings → Train Sojao.",
      "Pick a tone of voice, or describe your own.",
      "Write your real shipping and returns policies.",
      "Add the questions customers ask most, with your answers.",
      "Add hand-over words like “refund” so those chats come straight to you.",
    ],
    tip: "The AI only states facts written here. If it isn't sure, the chat goes to “Needs you”.",
  },
];

export default function GuidesPage() {
  return (
    <Background>
      <PageHero
        eyebrow="Guides"
        title="Learn Sojao in a few minutes."
        description="Short, step-by-step guides for the things brands set up first."
        primary={null}
      />
      <div className="container grid max-w-6xl grid-cols-1 gap-10 pb-10 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Guides" className="min-w-0 lg:sticky lg:top-36 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible">
            {guides.map((g) => (
              <li key={g.id} className="shrink-0">
                <a href={`#${g.id}`} className="text-muted-foreground hover:text-foreground hover:bg-accent/60 block rounded-lg px-3 py-2 text-sm transition-colors">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-6">
          {guides.map((g) => (
            <Reveal key={g.id}>
              <article id={g.id} className="bg-background/70 scroll-mt-32 rounded-3xl border p-6 backdrop-blur md:p-8">
                <p className="text-muted-foreground font-mono text-xs">{g.minutes} min</p>
                <h2 className="mt-2 text-2xl tracking-tight">{g.title}</h2>
                <ol className="mt-5 space-y-3">
                  {g.steps.map((s, i) => (
                    <li key={s} className="flex gap-3 text-sm leading-relaxed">
                      <span className="bg-brand/12 text-brand flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
                {g.tip && <p className="bg-brand/8 border-brand/20 mt-5 rounded-xl border px-4 py-3 text-sm">💡 {g.tip}</p>}
              </article>
            </Reveal>
          ))}
          <p className="text-muted-foreground text-sm">
            Stuck? <Link href="/contact" className="text-brand font-medium hover:underline">Contact us</Link> or read the{" "}
            <Link href="/faq" className="text-brand font-medium hover:underline">FAQ</Link>.
          </p>
        </div>
      </div>
    </Background>
  );
}
