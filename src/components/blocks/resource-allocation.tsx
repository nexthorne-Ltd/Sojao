import {
  AtSign,
  Download,
  KeyRound,
  MessageCircle,
  Send,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";

import { DashedLine } from "../dashed-line";

import { cn } from "@/lib/utils";

type Item = {
  title: string;
  description: string;
  icons: React.ComponentType<{ className?: string }>[];
};

const topItems: Item[] = [
  {
    title: "Comment-to-DM.",
    description:
      "Someone comments a word like “DROP” on your post. Sojao sends them the link in a private DM and asks for their email.",
    icons: [MessageCircle],
  },
  {
    title: "Story replies, mentions and keywords.",
    description:
      "Reply to story replies, thank people who mention you, and answer DMs that contain a word you choose.",
    icons: [AtSign, KeyRound],
  },
];

const bottomItems: Item[] = [
  {
    title: "Leads you can export.",
    description:
      "Every name, email and phone number shared in a chat lands in one list. Download it as CSV any time.",
    icons: [Download],
  },
  {
    title: "Tags and segments.",
    description:
      "Group customers by tag, source and last activity, then send a broadcast to just that group.",
    icons: [Tag, Users],
  },
  {
    title: "Follows Meta's rules.",
    description:
      "Promos only go to people who messaged you in the last 24 hours, and anyone who writes “stop” stops getting them.",
    icons: [ShieldCheck, Send],
  },
];

export const ResourceAllocation = () => {
  return (
    <section id="resource-allocation" className="overflow-hidden pb-28 lg:pb-32">
      <h2 className="container text-center text-3xl tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
        What Sojao Marketing does today.
      </h2>

      <div className="mt-8 md:mt-12 lg:mt-20">
        <DashedLine orientation="horizontal" className="container scale-x-105" />

        <div className="relative container flex max-md:flex-col">
          {topItems.map((item, i) => (
            <Feature key={item.title} item={item} isLast={i === topItems.length - 1} className="flex-1" />
          ))}
        </div>
        <DashedLine orientation="horizontal" className="container max-w-7xl scale-x-110" />

        <div className="relative container grid max-w-7xl md:grid-cols-3">
          {bottomItems.map((item, i) => (
            <Feature key={item.title} item={item} isLast={i === bottomItems.length - 1} />
          ))}
        </div>
      </div>
      <DashedLine orientation="horizontal" className="container max-w-7xl scale-x-110" />
    </section>
  );
};

function Feature({
  item,
  isLast,
  className,
}: {
  item: Item;
  isLast?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative flex flex-col gap-6 px-0 py-6 md:px-6 md:py-8", className)}>
      <div className="flex gap-2">
        {item.icons.map((Icon, j) => (
          <span key={j} className="bg-background flex size-12 items-center justify-center rounded-2xl border">
            <Icon className="size-5" />
          </span>
        ))}
      </div>
      <p className="text-balance">
        <span className="font-semibold">{item.title} </span>
        <span className="text-muted-foreground">{item.description}</span>
      </p>

      {!isLast && (
        <>
          <DashedLine orientation="vertical" className="absolute top-0 right-0 max-md:hidden" />
          <DashedLine orientation="horizontal" className="absolute inset-x-0 bottom-0 md:hidden" />
        </>
      )}
    </div>
  );
}
