import { BookOpen, Hand, Languages, ShieldAlert, Sparkles, UserCheck } from "lucide-react";

import { Background } from "@/components/background";
import { FeatureGrid, MiniChat, PageHero, SectionTitle, SplitRow, VisualFrame } from "@/components/blocks/kit";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI agent",
  description:
    "Sojao's AI agent replies in your brand's voice using only what's in your brand profile. When it isn't sure, it hands the chat to you.",
  path: "/ai-agent",
});

const rules = [
  { icon: BookOpen, title: "Only your facts", text: "Replies use your brand profile: policies, FAQs and products. Nothing else." },
  { icon: ShieldAlert, title: "No made-up offers", text: "If a reply mentions a price or offer you didn't add, it's blocked and you're asked instead." },
  { icon: Hand, title: "Hands over when unsure", text: "Not sure, or the customer asks for a person? The chat goes to “Needs you”." },
  { icon: Languages, title: "Matches their language", text: "Public comment replies can vary their wording and answer in the commenter's language." },
  { icon: Sparkles, title: "Your tone of voice", text: "Friendly, calm and premium, playful, or a tone you describe yourself." },
  { icon: UserCheck, title: "You can step in", text: "Take over any chat in the inbox, and hand it back when you're done." },
];

export default function AiAgentPage() {
  return (
    <Background>
      <PageHero
        eyebrow="AI agent"
        title="An AI that sounds like you, and knows when to stop."
        description="Sojao's AI writes replies from your brand profile. It never invents prices or offers, and it hands the chat to you when it isn't sure."
        secondary={{ label: "How it stays safe", href: "#rules" }}
      />

      <SplitRow
        eyebrow="Train it in minutes"
        title="Teach it your brand, once."
        text="Add your brand name, tone of voice, shipping and returns policies, and the questions customers ask most. That's what the AI answers from."
        points={["Tone of voice presets or your own description", "Policies and FAQs it can quote", "Hand-over words like “refund” or “human”"]}
        visual={
          <VisualFrame>
            <div className="space-y-3 text-left text-sm">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">Brand profile</p>
              <div className="bg-muted/60 rounded-xl p-3">
                <p className="text-muted-foreground text-xs">Tone of voice</p>
                <p className="font-medium">Friendly, short, a little playful</p>
              </div>
              <div className="bg-muted/60 rounded-xl p-3">
                <p className="text-muted-foreground text-xs">Shipping</p>
                <p className="font-medium">Free shipping over $75. 2–4 business days.</p>
              </div>
              <div className="bg-muted/60 rounded-xl p-3">
                <p className="text-muted-foreground text-xs">Hand-over words</p>
                <p className="font-medium">human, refund, complaint</p>
              </div>
            </div>
          </VisualFrame>
        }
      />

      <SplitRow
        reverse
        eyebrow="Where it works"
        title="Story replies, comments and other DMs."
        text="Turn on AI for story replies, let it vary public comment replies, and, if you choose, let it answer DMs that no automation matched."
        points={["Story replies: fixed message or AI reply", "Public comment replies: optional AI wording", "Other DMs: a switch in Settings, off by default"]}
        visual={
          <MiniChat
            header={<span>Story reply</span>}
            messages={[
              { from: "user", text: "Do you ship to Lahore? 😍" },
              { from: "bot", text: "We do! Delivery takes 2–4 business days, and it's free over $75 ✨" },
            ]}
            note="Example. The answer comes only from the brand profile."
          />
        }
      />

      <section id="rules" className="container max-w-6xl scroll-mt-32 py-14 lg:py-20">
        <SectionTitle eyebrow="Guardrails" title="Rules the AI always follows." />
        <div className="mt-12">
          <FeatureGrid items={rules} />
        </div>
      </section>
    </Background>
  );
}
