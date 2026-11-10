import {
  ArrowRight,
  Bot,
  Check,
  CheckCheck,
  Headset,
  Megaphone,
  MessageCircle,
  Package,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Simple, code-drawn product illustrations for the marketing site.
 * They show example conversations (not real customer data) and follow the
 * active theme tokens, so they stay on-brand in light and dark mode.
 */

type Bubble = { from: "customer" | "sojao" | "owner"; text: string };

function Thread({ messages, className }: { messages: Bubble[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      {messages.map((m, i) => (
        <div
          key={i}
          className={cn(
            "max-w-[85%] rounded-2xl px-3 py-2 leading-snug",
            m.from === "customer" && "bg-muted text-foreground self-start rounded-bl-md",
            m.from === "sojao" && "bg-primary text-primary-foreground self-end rounded-br-md",
            m.from === "owner" && "bg-brand self-end rounded-br-md text-white",
          )}
        >
          {m.from !== "customer" && (
            <span className="mb-0.5 flex items-center gap-1 text-[11px] font-semibold opacity-80">
              {m.from === "sojao" ? <Bot className="size-3" /> : <UserRound className="size-3" />}
              {m.from === "sojao" ? "Sojao" : "You"}
            </span>
          )}
          {m.text}
        </div>
      ))}
    </div>
  );
}

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("bg-background w-full rounded-2xl border p-4 shadow-sm", className)}
    >
      {children}
    </div>
  );
}

/* -------- "Replace three tools with one" -------- */

const JOBS = [
  { label: "DM marketing tool", icon: Megaphone },
  { label: "Sales assistant", icon: ShoppingBag },
  { label: "Support helpdesk", icon: Headset },
];

export function ThreeToolsGraphic() {
  return (
    <div
      role="img"
      aria-label="A DM marketing tool, a sales assistant and a support helpdesk, all replaced by Sojao"
      className="flex items-center gap-3 sm:gap-5"
    >
      <ul className="flex flex-1 flex-col gap-2.5">
        {JOBS.map(({ label, icon: Icon }) => (
          <li
            key={label}
            className="bg-background text-muted-foreground flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm"
          >
            <Icon className="size-4 shrink-0" />
            <span className="line-through decoration-1">{label}</span>
          </li>
        ))}
      </ul>
      <ArrowRight className="text-muted-foreground size-5 shrink-0" />
      <div className="bg-primary text-primary-foreground flex shrink-0 flex-col items-center gap-1.5 rounded-2xl px-5 py-6 shadow-md">
        <Bot className="size-7" />
        <span className="font-semibold">Sojao</span>
      </div>
    </div>
  );
}

/* -------- "Everything your DMs need" tiles -------- */

export function StoreAnswerMock() {
  return (
    <Frame>
      <Thread
        messages={[
          { from: "customer", text: "Is the linen dress available in size S?" },
          { from: "sojao", text: "Yes! 3 left in size S. Free shipping over $75. Want the link?" },
        ]}
      />
    </Frame>
  );
}

export function FollowUpMock() {
  return (
    <Frame>
      <Thread
        messages={[
          { from: "customer", text: "How much is shipping to Leeds?" },
          { from: "sojao", text: "It's free on this order. Still thinking it over?" },
        ]}
      />
      <p className="text-muted-foreground mt-3 text-center text-xs">
        Sojao followed up after 24 hours
      </p>
    </Frame>
  );
}

export function HandoverMock() {
  return (
    <Frame>
      <div className="bg-brand/10 text-foreground mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium">
        <UserRound className="size-3.5" /> Handed to you · custom order request
      </div>
      <Thread messages={[{ from: "owner", text: "Happy to make it in blue. Ready in 2 weeks!" }]} />
    </Frame>
  );
}

export function OrderUpdateMock() {
  return (
    <Frame>
      <ul className="space-y-2.5 text-sm">
        {[
          { icon: Check, text: "Order confirmed" },
          { icon: Package, text: "Shipped · tracking link sent" },
          { icon: CheckCheck, text: "Delivered" },
        ].map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2.5">
            <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full">
              <Icon className="size-3.5" />
            </span>
            {text}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/* -------- Three-pillar feature cards -------- */

export function MarketingMock() {
  return (
    <Frame className="h-full">
      <div className="text-muted-foreground mb-3 flex items-center gap-2 text-xs">
        <MessageCircle className="size-3.5" /> Comment on your post: “DROP”
      </div>
      <Thread
        messages={[
          { from: "sojao", text: "Hi! Here's early access to the summer drop 👇" },
          { from: "customer", text: "Yes please!" },
        ]}
      />
    </Frame>
  );
}

export function SalesMock() {
  return (
    <Frame className="h-full">
      <Thread messages={[{ from: "customer", text: "I'll take the black one in M" }]} />
      <div className="mt-3 flex items-center gap-3 rounded-xl border p-2.5">
        <span className="bg-muted flex size-10 items-center justify-center rounded-lg">
          <ShoppingBag className="size-4" />
        </span>
        <div className="flex-1 text-sm">
          <p className="font-medium">Everyday tote · M</p>
          <p className="text-muted-foreground text-xs">Checkout link sent</p>
        </div>
      </div>
    </Frame>
  );
}

export function SupportMock() {
  return (
    <Frame className="h-full">
      <Thread
        messages={[
          { from: "customer", text: "Where is my order?" },
          { from: "sojao", text: "It's out for delivery and should arrive today 📦" },
        ]}
      />
    </Frame>
  );
}
