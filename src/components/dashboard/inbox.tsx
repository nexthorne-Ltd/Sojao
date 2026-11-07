"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Bot,
  Check,
  CheckCheck,
  Send,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  Avatar,
  Badge,
  ChannelIcon,
  Tabs,
  channelLabel,
  money,
} from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import {
  type Channel,
  type Conversation,
  type ConversationStatus,
  type Message,
  conversations as seed,
  customerById,
} from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

type Filter = "all" | ConversationStatus;

const statusBadge: Record<ConversationStatus, React.ReactNode> = {
  ai: (
    <Badge tone="brand">
      <Bot className="size-3" /> Sojao
    </Badge>
  ),
  "needs-you": <Badge tone="warn">Needs you</Badge>,
  resolved: (
    <Badge tone="good">
      <Check className="size-3" /> Resolved
    </Badge>
  ),
};

const now = () =>
  new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export function InboxView({ initialId }: { initialId: string | null }) {
  const [items, setItems] = useState<Conversation[]>(seed);
  const [filter, setFilter] = useState<Filter>("all");
  const [channel, setChannel] = useState<Channel | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(initialId);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const list = useMemo(
    () =>
      items.filter(
        (c) =>
          (filter === "all" || c.status === filter) &&
          (channel === "all" || c.channel === channel),
      ),
    [items, filter, channel],
  );

  const active = items.find((c) => c.id === activeId) ?? null;
  const customer = active ? customerById(active.customerId) : null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [active?.messages.length, typing]);

  const update = (id: string, fn: (c: Conversation) => Conversation) =>
    setItems((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));

  const open = (id: string) => {
    setActiveId(id);
    update(id, (c) => ({ ...c, unread: false }));
  };

  const push = (msg: Message, status?: ConversationStatus) => {
    if (!active) return;
    update(active.id, (c) => ({
      ...c,
      status: status ?? c.status,
      preview: msg.text,
      time: "now",
      messages: [...c.messages, msg],
    }));
  };

  const sendOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    push({ from: "owner", text: draft.trim(), time: now() }, "needs-you");
    setDraft("");
  };

  const letSojaoReply = () => {
    if (!active || !customer) return;
    setTyping(true);
    const id = active.id;
    setTimeout(() => {
      setTyping(false);
      update(id, (c) => ({
        ...c,
        status: "ai",
        preview: "Sojao replied",
        time: "now",
        messages: [
          ...c.messages,
          {
            from: "ai",
            text: `Thanks for waiting, ${customer.name.split(" ")[0]}! I've checked with the team and they're on it. Is there anything else I can help with in the meantime?`,
            time: now(),
          },
        ],
      }));
    }, 1400);
  };

  const counts = {
    all: items.length,
    "needs-you": items.filter((c) => c.status === "needs-you").length,
    ai: items.filter((c) => c.status === "ai").length,
    resolved: items.filter((c) => c.status === "resolved").length,
  };

  return (
    <div className="bg-card flex h-[calc(100dvh-4rem-var(--banner-h,0px))] overflow-hidden">
      {/* List */}
      <aside
        className={cn(
          "flex w-full shrink-0 flex-col border-r md:w-80 xl:w-96",
          active && "max-md:hidden",
        )}
      >
        <div className="space-y-3 border-b p-4">
          <h1 className="sr-only">Inbox</h1>
          <Tabs
            tabs={[
              { id: "all", label: "All", count: counts.all },
              { id: "needs-you", label: "Needs you", count: counts["needs-you"] },
              { id: "ai", label: "Sojao", count: counts.ai },
              { id: "resolved", label: "Done", count: counts.resolved },
            ]}
            value={filter}
            onChange={setFilter}
            className="w-full"
          />
          <div className="flex gap-2">
            {(["all", "instagram", "messenger", "whatsapp"] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs",
                  channel === ch
                    ? "bg-primary text-primary-foreground border-transparent"
                    : "hover:bg-accent",
                )}
              >
                {ch === "all" ? "All apps" : <ChannelIcon channel={ch} className="size-3.5" />}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex-1 divide-y overflow-y-auto">
          {list.length === 0 && (
            <li className="text-muted-foreground p-6 text-center text-sm">
              Nothing here. Sleep tight. 🌙
            </li>
          )}
          {list.map((c) => {
            const cust = customerById(c.customerId);
            return (
              <li key={c.id}>
                <button
                  onClick={() => open(c.id)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                    c.id === activeId ? "bg-accent" : "hover:bg-accent/50",
                  )}
                >
                  <div className="relative">
                    <Avatar name={cust.name} />
                    <span className="bg-background absolute -right-1 -bottom-1 rounded-full p-0.5">
                      <ChannelIcon channel={c.channel} className="size-3" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-sm",
                          c.unread ? "font-semibold" : "font-medium",
                        )}
                      >
                        {cust.name}
                      </span>
                      <span className="text-muted-foreground shrink-0 text-xs">
                        {c.time}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                      {c.preview}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {statusBadge[c.status]}
                      <Badge>{c.pillar}</Badge>
                      {c.unread && (
                        <span className="bg-brand ml-auto size-2 rounded-full" />
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Thread */}
      {active && customer ? (
        <>
          <section className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center gap-3 border-b px-4 py-3">
              <button
                className="text-muted-foreground md:hidden"
                onClick={() => setActiveId(null)}
                aria-label="Back to chats"
              >
                <ArrowLeft className="size-5" />
              </button>
              <Avatar name={customer.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{customer.name}</p>
                <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <ChannelIcon channel={active.channel} className="size-3" />
                  {channelLabel(active.channel)} · {customer.handle}
                </p>
              </div>
              <span className="max-lg:hidden">{statusBadge[active.status]}</span>
              {active.status !== "resolved" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    update(active.id, (c) => ({ ...c, status: "resolved" }))
                  }
                >
                  <CheckCheck className="size-4" />
                  <span className="max-sm:hidden">Mark done</span>
                </Button>
              )}
            </header>

            <div className="bg-muted/30 flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
              {active.messages.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}
              {typing && (
                <div className="flex justify-end">
                  <div className="bg-primary/80 text-primary-foreground flex gap-1 rounded-2xl rounded-br-sm px-4 py-3">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="mascot-dot size-1.5 rounded-full bg-current"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={sendOwner} className="space-y-2 border-t p-3 md:p-4">
              {active.status === "needs-you" && (
                <p className="bg-amber-500/10 rounded-lg px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
                  Sojao handed this chat to you. Reply below, and Sojao will
                  learn from your answer.
                </p>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) sendOwner(e);
                  }}
                  rows={1}
                  placeholder="Reply as you…"
                  className="bg-background focus-visible:ring-ring/50 max-h-32 min-h-10 flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm outline-none focus-visible:ring-[3px]"
                />
                <Button type="submit" size="icon" className="size-10" aria-label="Send">
                  <Send className="size-4" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={letSojaoReply}
                  disabled={typing}
                >
                  <Sparkles className="size-4" /> Let Sojao reply
                </Button>
                <span className="text-muted-foreground text-xs">
                  Enter to send · Shift + Enter for a new line
                </span>
              </div>
            </form>
          </section>

          {/* Customer panel */}
          <aside className="hidden w-72 shrink-0 overflow-y-auto border-l p-5 xl:block">
            <div className="flex flex-col items-center text-center">
              <Avatar name={customer.name} className="size-14 text-base" />
              <p className="mt-3 font-semibold">{customer.name}</p>
              <p className="text-muted-foreground text-xs">{customer.city}</p>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-center">
              <div className="bg-muted rounded-xl p-3">
                <dt className="text-muted-foreground text-xs">Orders</dt>
                <dd className="font-semibold">{customer.orders}</dd>
              </div>
              <div className="bg-muted rounded-xl p-3">
                <dt className="text-muted-foreground text-xs">Spent</dt>
                <dd className="font-semibold">{money(customer.spent)}</dd>
              </div>
            </dl>
            <div className="mt-5">
              <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {customer.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </div>
            <div className="mt-5 space-y-1 text-sm">
              <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                Contact
              </p>
              <p>{customer.handle}</p>
              {customer.email && <p className="text-muted-foreground">{customer.email}</p>}
              {customer.phone && <p className="text-muted-foreground">{customer.phone}</p>}
            </div>
            <div className="mt-5">
              <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                What Sojao remembers
              </p>
              <p className="bg-muted rounded-xl p-3 text-sm">
                {customer.notes || "Nothing yet. Sojao learns from every chat."}
              </p>
            </div>
            <Link
              href={`/dashboard/customers?c=${customer.id}`}
              className="text-foreground mt-5 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
            >
              <UserRound className="size-4" /> Full profile
            </Link>
          </aside>
        </>
      ) : (
        <section className="text-muted-foreground hidden flex-1 flex-col items-center justify-center gap-3 p-10 text-center md:flex">
          <span className="mascot-blob block size-16" />
          <p className="text-foreground font-medium">Pick a chat to read it</p>
          <p className="max-w-xs text-sm">
            Sojao handles most chats by itself. Anything it isn&apos;t sure
            about shows up under “Needs you”.
          </p>
        </section>
      )}
    </div>
  );
}

function Bubble({ m }: { m: Message }) {
  const mine = m.from !== "customer";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[80%] space-y-1", mine && "items-end text-right")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-left text-sm",
            m.from === "customer" && "bg-background rounded-bl-sm border",
            m.from === "ai" && "bg-primary text-primary-foreground rounded-br-sm",
            m.from === "owner" && "bg-foreground text-background rounded-br-sm",
          )}
        >
          {m.text}
          {m.checkout && (
            <div className="bg-background text-foreground mt-2 flex items-center gap-3 rounded-xl border p-3">
              <span className="bg-brand/15 flex size-9 items-center justify-center rounded-lg">
                <ShoppingBag className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{m.checkout.product}</p>
                <p className="text-muted-foreground text-xs">
                  {money(m.checkout.price)}
                </p>
              </div>
              <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-1 text-xs font-medium">
                Checkout
              </span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground px-1 text-[11px]">
          {m.from === "ai" ? "Sojao" : m.from === "owner" ? "You" : ""}
          {m.from !== "customer" && " · "}
          {m.time}
        </p>
      </div>
    </div>
  );
}
