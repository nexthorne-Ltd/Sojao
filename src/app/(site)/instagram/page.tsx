import { AtSign, Download, Gift, KeyRound, ListChecks, MessageCircle, Reply, Send, ShieldCheck, Tag } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

import { Background } from "@/components/background";
import { HowItWorks } from "@/components/blocks/how-it-works";
import { FeatureGrid, MiniChat, PageHero, SectionTitle, SplitRow } from "@/components/blocks/kit";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Instagram automation",
  description:
    "Automate Instagram comments, story replies, mentions and DMs with Sojao. Capture leads in the chat and send broadcasts, inside Instagram's rules.",
  path: "/instagram",
});

const features = [
  { icon: MessageCircle, title: "Comment-to-DM", text: "Someone comments a word on a post or reel and gets one private reply with your link." },
  { icon: Reply, title: "Story replies", text: "Answer story replies with a fixed message, or an AI reply from your brand profile." },
  { icon: AtSign, title: "Mention thank-yous", text: "Thank people who mention you in their story, with an optional offer you write." },
  { icon: KeyRound, title: "DM keywords", text: "A DM contains “price” or “size”? Sojao sends the saved answer." },
  { icon: ListChecks, title: "Lead capture", text: "Ask for name, email and phone inside any flow. All skippable, with consent saved." },
  { icon: Send, title: "Broadcasts and drips", text: "Message a tag or segment, or send a short follow-up series." },
  { icon: Gift, title: "Giveaways", text: "Collect entries from comments and DMs, then message everyone who joined." },
  { icon: Tag, title: "Tags and segments", text: "Tag people by post, keyword or answer, and group them automatically." },
  { icon: Download, title: "CSV export", text: "Take your leads to any email or SMS tool, any time." },
];

export default function InstagramPage() {
  return (
    <Background>
      <PageHero
        eyebrow={
          <>
            <FaInstagram className="size-4" /> Instagram automation
          </>
        }
        badge="Live in beta"
        title="Turn every comment and DM into a customer."
        description="Sojao replies to comments, story replies, mentions and DMs on Instagram, captures leads and sends your promos, day and night."
        secondary={{ label: "See templates", href: "/templates" }}
      />

      <SplitRow
        eyebrow="Comment-to-DM"
        title="Comments in, links out."
        text="Post a reel, ask people to comment a word, and Sojao sends each of them the link in a private DM. You can also reply publicly under the comment, with your approval."
        points={[
          "One private reply per comment, as Instagram allows",
          "Ask first, then send the link once they answer",
          "Public replies rotate and never repeat within an hour",
        ]}
        visual={
          <MiniChat
            header={<span>@yourbrand · DM</span>}
            messages={[
              { from: "bot", text: "Hey! Thanks for commenting 💌 Want the link to the new drop?" },
              { from: "user", text: "Yes please" },
              { from: "bot", text: "Here you go 👉 yourbrand.shop/drop" },
            ]}
          />
        }
      />

      <SplitRow
        reverse
        eyebrow="Lead capture"
        title="Ask for the email while they're interested."
        text="Add a lead step to any automation. Sojao checks the email and phone format, saves the consent text, and tags the lead by where it came from."
        points={["Name, email and phone, each skippable", "Consent text shown first and saved", "Export to CSV any time"]}
        cta={{ label: "Read the lead capture guide", href: "/guides#lead-capture" }}
        visual={
          <MiniChat
            header={<span>@yourbrand · DM</span>}
            messages={[
              { from: "bot", text: "Want early access next time? Share your email 👇" },
              { from: "user", text: "sara@example.com" },
              { from: "bot", text: "You're on the list ✨" },
            ]}
          />
        }
      />

      <section className="container max-w-6xl py-14 lg:py-20">
        <SectionTitle eyebrow="Everything on Instagram" title="All the automations, in one place." />
        <div className="mt-12">
          <FeatureGrid items={features} />
        </div>
      </section>

      <div className="pt-14">
        <HowItWorks />
      </div>

      <section className="container max-w-3xl pb-10">
        <SectionTitle
          eyebrow="Inside Instagram's rules"
          title="Built so your account stays safe."
          text="Promos only go to people who messaged you in the last 24 hours, private replies stay within Instagram's limits, and “stop” always works."
        />
        <div className="mt-8 flex justify-center">
          <a href="/security" className="text-brand inline-flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-4" /> How Sojao keeps your account safe
          </a>
        </div>
      </section>
    </Background>
  );
}
