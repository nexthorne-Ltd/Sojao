"use client";

import {
  AtSign,
  Bell,
  Download,
  Gift,
  KeyRound,
  ListChecks,
  MessageCircle,
  QrCode,
  Reply,
  Send,
  Tag,
  Ticket,
} from "lucide-react";
import Marquee from "react-fast-marquee";

/** Every item here is a live Sojao Marketing feature. */
const ITEMS = [
  { label: "Comment-to-DM", icon: MessageCircle },
  { label: "Story replies", icon: Reply },
  { label: "Mention thank-yous", icon: AtSign },
  { label: "DM keywords", icon: KeyRound },
  { label: "Lead capture", icon: ListChecks },
  { label: "Broadcasts", icon: Send },
  { label: "Drip sequences", icon: Send },
  { label: "Giveaways", icon: Gift },
  { label: "Tags and segments", icon: Tag },
  { label: "Back-in-stock alerts", icon: Bell },
  { label: "Discount codes", icon: Ticket },
  { label: "QR codes and links", icon: QrCode },
  { label: "CSV export", icon: Download },
];

export function AutomationTicker() {
  return (
    <section aria-label="What Sojao automates" className="pb-20 lg:pb-24">
      <div className="[mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <Marquee speed={36} pauseOnHover autoFill>
          {ITEMS.map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="bg-background/80 text-foreground mx-1.5 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm"
            >
              <Icon className="text-brand size-4" /> {label}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
