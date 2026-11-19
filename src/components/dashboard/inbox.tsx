"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { ArrowLeft, Bot, CircleAlert, Hand, Loader2, Search, Send, UserRound } from "lucide-react";

import { timeAgo } from "@/components/dashboard/notifications";
import { Avatar, Badge, ChannelIcon, Tabs } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

type Filter = "all" | "needs_you" | "unread";

type ListItem = {
  id: string;
  needsHuman: boolean;
  needsHumanReason: string | null;
  lastMessageAt: string;
  unread: boolean;
  preview: string | null;
  lastDirection: "in" | "out" | null;
  customer: { id: string; name: string | null; username: string | null; optedOut: boolean; lastInboundAt: string | null };
};

type Msg = { id: string; from: "customer" | "ai" | "owner"; text: string | null; type: string; status: string; reason: string | null; at: string };
type Detail = {
  conversation: { id: string; needsHuman: boolean; needsHumanReason: string | null };
  customer: { id: string; name: string | null; username: string | null; email: string | null; phone: string | null; tags: string[]; source: string | null; optedOut: boolean; lastInboundAt: string | null };
  windowOpen: boolean;
  orders: { count: number; spent: number; currency: string };
  messages: Msg[];
};

const displayName = (c: { name: string | null; username: string | null }) => c.name ?? (c.username ? `@${c.username}` : "Customer");
const clock = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const reasonText = (r: string | null) =>
  (
    ({
      owner_took_over: "You took over this chat.",
      handover_word: "The customer asked for a person.",
      agent_unsure: "Sojao wasn't sure how to answer.",
      agent_not_configured: "AI replies aren't switched on for Sojao yet, so this chat needs you.",
      opted_out: "This person opted out.",
    }) as Record<string, string>
  )[r ?? ""] ?? (r ? r.replaceAll("_", " ") : "Sojao handed this chat to you.");

export function InboxView({ initialId }: { initialId: string | null }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<ListItem[] | null>(null);
  const [listErr, setListErr] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(initialId);

  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("filter");
    if (f === "needs_you" || f === "unread") setFilter(f);
  }, []);

  const loadList = useCallback(async () => {
    try {
      const r = await api<{ conversations: ListItem[] }>(`/conversations?filter=${filter}${q.trim() ? `&q=${encodeURIComponent(q.trim())}` : ""}`);
      setItems(r.conversations);
      setListErr(null);
    } catch (e) {
      setListErr(e instanceof ApiError ? e.readable : "Can't load chats.");
    }
  }, [filter, q]);

  useEffect(() => {
    const t = setTimeout(() => void loadList(), q ? 300 : 0);
    const poll = setInterval(() => void loadList(), 15_000);
    return () => {
      clearTimeout(t);
      clearInterval(poll);
    };
  }, [loadList, q]);

  const open = (id: string) => {
    setActiveId(id);
    setItems((x) => x?.map((c) => (c.id === id ? { ...c, unread: false } : c)) ?? null);
    try {
      window.history.replaceState(null, "", `/dashboard/inbox?c=${id}`);
    } catch {}
  };

  return (
    <div className="bg-card flex h-[calc(100dvh-4rem-var(--banner-h,0px))] overflow-hidden">
      <aside className={cn("flex w-full shrink-0 flex-col border-r md:w-80 xl:w-96", activeId && "max-md:hidden")}>
        <div className="space-y-3 border-b p-4">
          <h1 className="sr-only">Inbox</h1>
          <Tabs
            tabs={[
              { id: "all", label: "All" },
              { id: "needs_you", label: "Needs you" },
              { id: "unread", label: "Unread" },
            ]}
            value={filter}
            onChange={setFilter}
            className="w-full"
          />
          <label className="bg-background flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
            <Search className="text-muted-foreground size-4" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or @username" aria-label="Search chats" className="min-w-0 flex-1 bg-transparent outline-none" />
          </label>
        </div>

        <ul className="flex-1 divide-y overflow-y-auto">
          {listErr && <li className="p-4 text-sm text-rose-600">{listErr}</li>}
          {items === null && !listErr && (
            <li className="text-muted-foreground flex items-center justify-center gap-2 p-6 text-sm">
              <Loader2 className="size-4 animate-spin" /> Loading chats…
            </li>
          )}
          {items?.length === 0 && (
            <li className="text-muted-foreground p-6 text-center text-sm">
              {filter === "all" && !q ? "No chats yet. When people message your Instagram, they show up here." : "Nothing here. 🌙"}
            </li>
          )}
          {items?.map((c) => (
            <li key={c.id}>
              <button onClick={() => open(c.id)} className={cn("flex w-full items-start gap-3 px-4 py-3 text-left transition-colors", c.id === activeId ? "bg-accent" : "hover:bg-accent/50")}>
                <div className="relative">
                  <Avatar name={displayName(c.customer)} />
                  <span className="bg-background absolute -right-1 -bottom-1 rounded-full p-0.5">
                    <ChannelIcon channel="instagram" className="size-3" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("truncate text-sm", c.unread ? "font-semibold" : "font-medium")}>{displayName(c.customer)}</span>
                    <span className="text-muted-foreground shrink-0 text-xs">{timeAgo(c.lastMessageAt)}</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    {c.lastDirection === "out" && "You: "}
                    {c.preview ?? "…"}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {c.needsHuman ? (
                      <Badge tone="warn">Needs you</Badge>
                    ) : (
                      <Badge tone="brand">
                        <Bot className="size-3" /> Sojao
                      </Badge>
                    )}
                    {c.unread && <span className="bg-brand ml-auto size-2 rounded-full" />}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {activeId ? (
        <Thread key={activeId} id={activeId} onBack={() => setActiveId(null)} onChanged={() => void loadList()} />
      ) : (
        <section className="text-muted-foreground hidden flex-1 flex-col items-center justify-center gap-3 p-10 text-center md:flex">
          <span className="mascot-blob block size-16" />
          <p className="text-foreground font-medium">Pick a chat to read it</p>
          <p className="max-w-xs text-sm">Sojao handles most chats by itself. Anything it isn&apos;t sure about shows up under “Needs you”.</p>
        </section>
      )}
    </div>
  );
}

function Thread({ id, onBack, onChanged }: { id: string; onBack: () => void; onChanged: () => void }) {
  const [d, setD] = useState<Detail | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      setD(await api<Detail>(`/conversations/${id}`));
      setErr(null);
    } catch (e) {
      setErr(e instanceof ApiError ? e.readable : "Can't load this chat.");
    }
  }, [id]);

  useEffect(() => {
    void load().then(() => api(`/conversations/${id}/read`, { method: "POST" }).then(onChanged).catch(() => {}));
    const t = setInterval(() => void load(), 10_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [d?.messages.length]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    setSendErr(null);
    try {
      await api(`/conversations/${id}/reply`, { method: "POST", body: { text: draft.trim() } });
      setDraft("");
      await load();
      onChanged();
    } catch (x) {
      setSendErr(x instanceof ApiError ? x.readable : "Not sent. Try again.");
    } finally {
      setSending(false);
    }
  };

  const handover = async (needsHuman: boolean) => {
    await api(`/conversations/${id}/handover`, { method: "POST", body: { needsHuman } }).catch(() => {});
    await load();
    onChanged();
  };

  if (err) return <section className="flex flex-1 items-center justify-center p-6 text-sm text-rose-600">{err}</section>;
  if (!d)
    return (
      <section className="text-muted-foreground flex flex-1 items-center justify-center gap-2 text-sm">
        <Loader2 className="size-4 animate-spin" /> Loading…
      </section>
    );
  const name = displayName(d.customer);
  const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: d.orders.currency, maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <button className="text-muted-foreground md:hidden" onClick={onBack} aria-label="Back to chats">
            <ArrowLeft className="size-5" />
          </button>
          <Avatar name={name} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{name}</p>
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <ChannelIcon channel="instagram" className="size-3" />
              Instagram{d.customer.username ? ` · @${d.customer.username}` : ""}
            </p>
          </div>
          {d.conversation.needsHuman ? (
            <Button size="sm" variant="outline" onClick={() => void handover(false)} title="Sojao answers this person again">
              <Bot className="size-4" />
              <span className="max-sm:hidden">Hand back to Sojao</span>
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => void handover(true)} title="Pause Sojao for this person; you reply">
              <Hand className="size-4" />
              <span className="max-sm:hidden">Take over</span>
            </Button>
          )}
        </header>

        <div className="bg-muted/30 flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {d.messages.length === 0 && <p className="text-muted-foreground text-center text-sm">No messages yet.</p>}
          {d.messages.map((m) => (
            <Bubble key={m.id} m={m} />
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="space-y-2 border-t p-3 md:p-4">
          {d.conversation.needsHuman && (
            <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">{reasonText(d.conversation.needsHumanReason)} Sojao is paused for this person until you hand it back.</p>
          )}
          {!d.windowOpen && (
            <p className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-xs">Instagram only allows replies within 24 hours of the customer&apos;s last message. You can reply again when they write.</p>
          )}
          {sendErr && (
            <p role="alert" className="flex items-center gap-1.5 text-xs text-rose-600">
              <CircleAlert className="size-3.5" /> {sendErr}
            </p>
          )}
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) void send(e);
              }}
              rows={1}
              maxLength={1000}
              disabled={!d.windowOpen || d.customer.optedOut}
              placeholder={d.customer.optedOut ? "This person opted out of messages" : "Reply as you…"}
              aria-label="Reply"
              className="bg-background focus-visible:ring-ring/50 max-h-32 min-h-10 flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm outline-none focus-visible:ring-[3px] disabled:opacity-60"
            />
            <Button type="submit" size="icon" className="size-10" aria-label="Send" disabled={sending || !draft.trim() || !d.windowOpen}>
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">Enter to send · Shift + Enter for a new line</p>
        </form>
      </section>

      <aside className="hidden w-72 shrink-0 overflow-y-auto border-l p-5 xl:block">
        <div className="flex flex-col items-center text-center">
          <Avatar name={name} className="size-14 text-base" />
          <p className="mt-3 font-semibold">{name}</p>
          {d.customer.username && <p className="text-muted-foreground text-xs">@{d.customer.username}</p>}
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-center">
          <div className="bg-muted rounded-xl p-3">
            <dt className="text-muted-foreground text-xs">Orders</dt>
            <dd className="font-semibold">{d.orders.count}</dd>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <dt className="text-muted-foreground text-xs">Spent</dt>
            <dd className="font-semibold">{money(d.orders.spent)}</dd>
          </div>
        </dl>
        <div className="mt-5">
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">Tags</p>
          <div className="flex flex-wrap gap-1.5">{d.customer.tags.length ? d.customer.tags.map((t) => <Badge key={t}>{t}</Badge>) : <span className="text-muted-foreground text-sm">None</span>}</div>
        </div>
        <div className="mt-5 space-y-1 text-sm">
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">Contact</p>
          {d.customer.email && <p>{d.customer.email}</p>}
          {d.customer.phone && <p>{d.customer.phone}</p>}
          {!d.customer.email && !d.customer.phone && <p className="text-muted-foreground">Not shared yet</p>}
          {d.customer.optedOut && <Badge tone="bad">Opted out</Badge>}
        </div>
        <Link href={`/dashboard/customers?c=${d.customer.id}`} className="text-foreground mt-5 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4">
          <UserRound className="size-4" /> Full profile
        </Link>
      </aside>
    </>
  );
}

function Bubble({ m }: { m: Msg }) {
  const mine = m.from !== "customer";
  const failed = m.status === "blocked" || m.status === "failed";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[80%] space-y-1", mine && "items-end text-right")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-left text-sm whitespace-pre-wrap",
            m.from === "customer" && "bg-background rounded-bl-sm border",
            m.from === "ai" && "bg-primary text-primary-foreground rounded-br-sm",
            m.from === "owner" && "bg-foreground text-background rounded-br-sm",
            failed && "opacity-60",
          )}
        >
          {m.text ?? (m.type === "image" ? "📷 Photo" : m.type === "story_mention" ? "Mentioned you in a story" : `(${m.type.replaceAll("_", " ")})`)}
        </div>
        <p className="text-muted-foreground px-1 text-[11px]">
          {m.from === "ai" ? "Sojao · " : m.from === "owner" ? "You · " : ""}
          {clock(m.at)}
          {failed && <span className="text-rose-600"> · not sent ({(m.reason ?? m.status).replaceAll("_", " ")})</span>}
          {m.status === "queued" && " · sending…"}
        </p>
      </div>
    </div>
  );
}
