import { Inbox, KeyRound, ListChecks, Send, Sparkles, Tag } from "lucide-react";
import { FaFacebookMessenger } from "react-icons/fa";

import { Background } from "@/components/background";
import { FeatureGrid, PageHero, SectionTitle } from "@/components/blocks/kit";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Messenger automation",
  description:
    "Sojao for Facebook Messenger is coming soon. Join the beta to use Instagram automations today and hear first when Messenger opens.",
  path: "/messenger",
});

// Not live in the product yet: the dashboard shows "Messenger is not available yet".
const planned = [
  { icon: Sparkles, title: "Welcome messages", text: "Greet people who message your Facebook Page for the first time." },
  { icon: KeyRound, title: "Keyword replies", text: "Send a saved answer when a message contains a word you pick." },
  { icon: ListChecks, title: "Lead capture", text: "Collect name, email and phone in the chat, with consent." },
  { icon: Tag, title: "Same tags and segments", text: "One customer list across Instagram and Messenger." },
  { icon: Send, title: "Broadcasts", text: "Message a segment, inside Meta's 24-hour window." },
  { icon: Inbox, title: "One inbox", text: "Instagram and Messenger chats side by side." },
];

export default function MessengerPage() {
  return (
    <Background>
      <PageHero
        eyebrow={
          <>
            <FaFacebookMessenger className="size-4" /> Messenger
          </>
        }
        badge="Coming soon"
        title="Messenger is next."
        description="We're bringing Sojao's automations to Facebook Messenger. It isn't live yet. Join the beta to use Instagram today and hear first when Messenger opens."
        secondary={{ label: "See the roadmap", href: "/roadmap" }}
      />
      <section className="container max-w-6xl pb-10">
        <SectionTitle eyebrow="What's planned" title="What Messenger will do." text="Plans can change based on what beta brands need." />
        <div className="mt-12">
          <FeatureGrid items={planned.map((p) => ({ ...p, badge: "Planned" }))} />
        </div>
      </section>
    </Background>
  );
}
