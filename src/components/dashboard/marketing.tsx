"use client";

import { useState } from "react";

import {
  CalendarClock,
  Check,
  Copy,
  Gift,
  Link2,
  Lock,
  Megaphone,
  MessageCircle,
  Plus,
  QrCode,
  Send,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";

import {
  Badge,
  ChannelIcon,
  PageHeader,
  Panel,
  Table,
  Tabs,
  Td,
  Th,
  Toggle,
  money,
} from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import {
  automations,
  brand,
  broadcasts,
  giveaways,
  sequences,
} from "@/lib/dashboard-data";

type Tab = "automations" | "broadcasts" | "sequences" | "giveaways" | "growth";

const planRank = { Starter: 0, Growth: 1, Pro: 2 } as const;
const hasPlan = (p: keyof typeof planRank) =>
  planRank[brand.plan as keyof typeof planRank] >= planRank[p];

export function MarketingView({ initialGoal }: { initialGoal: string }) {
  const [tab, setTab] = useState<Tab>("automations");
  const [goal, setGoal] = useState(initialGoal);
  const [plan, setPlan] = useState<null | {
    goal: string;
    sent: boolean;
  }>(initialGoal ? { goal: initialGoal, sent: false } : null);

  return (
    <>
      <PageHeader
        title="Marketing"
        description="Bring customers in. Comment-to-DM, story replies, broadcasts and more, with no flows to build."
        actions={
          <Button onClick={() => setTab("automations")}>
            <Plus className="size-4" /> New automation
          </Button>
        }
      />

      {/* Goal planner */}
      <Panel
        className="mb-6"
        title={
          <span className="flex items-center gap-2">
            <Sparkles className="size-4" /> Type a goal
          </span>
        }
        description="Sojao picks the audience, writes the message, and closes the sale when people reply."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (goal.trim()) setPlan({ goal: goal.trim(), sent: false });
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Send a promo for the new collection"
            className="bg-background focus-visible:ring-ring/50 h-10 flex-1 rounded-xl border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
          <Button type="submit">
            <Target className="size-4" /> Plan it
          </Button>
        </form>

        {plan && (
          <div className="bg-muted/50 mt-5 grid gap-4 rounded-xl border p-4 md:grid-cols-[1fr_1.4fr]">
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Sojao&apos;s plan for “{plan.goal}”
              </p>
              <Row label="Audience" value="Customers tagged Dresses or VIP · 412 people" />
              <Row label="Channel" value="Instagram DM + WhatsApp" />
              <Row label="When" value="Thu 7:00 PM (when your customers are most active)" />
              <Row label="Follow-up" value="Reminder to non-buyers after 24 hours" />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                Message draft
              </p>
              <div className="bg-background rounded-xl border p-3 text-sm">
                Hi {"{first name}"}! 🌙 Our new collection just landed, and we
                saved you first look. Light linen, easy fits, made for warm
                nights. Want me to send you the pieces in your size?
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => setPlan({ ...plan, sent: true })}
                  disabled={plan.sent}
                >
                  {plan.sent ? (
                    <>
                      <Check className="size-4" /> Scheduled
                    </>
                  ) : (
                    <>
                      <CalendarClock className="size-4" /> Schedule it
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline">
                  Edit message
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPlan(null)}>
                  Discard
                </Button>
              </div>
            </div>
          </div>
        )}
      </Panel>

      <Tabs
        className="mb-4"
        tabs={[
          { id: "automations", label: "Automations", count: automations.length },
          { id: "broadcasts", label: "Broadcasts", count: broadcasts.length },
          { id: "sequences", label: "Drip sequences", count: sequences.length },
          { id: "giveaways", label: "Giveaways" },
          { id: "growth", label: "Growth tools" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "automations" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {automations.map((a) => {
            const locked = !hasPlan(a.plan);
            return (
              <div key={a.id} className="bg-card rounded-2xl border p-5 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <span className="bg-brand/12 flex size-10 items-center justify-center rounded-xl">
                    {a.kind === "Comment-to-DM" ? (
                      <MessageCircle className="size-5" />
                    ) : a.kind === "Keyword" ? (
                      <Workflow className="size-5" />
                    ) : (
                      <Megaphone className="size-5" />
                    )}
                  </span>
                  {locked ? (
                    <Badge>
                      <Lock className="size-3" /> {a.plan}
                    </Badge>
                  ) : (
                    <Toggle defaultOn={a.enabled} label={`Turn ${a.name} on or off`} />
                  )}
                </div>
                <p className="mt-4 font-semibold">{a.name}</p>
                <p className="text-muted-foreground mt-1 text-sm">{a.trigger}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Badge>{a.kind}</Badge>
                  <ChannelIcon channel="instagram" className="size-3.5" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Runs</p>
                    <p className="font-semibold tabular-nums">{a.runs}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Leads captured</p>
                    <p className="font-semibold tabular-nums">{a.leads}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <button className="text-muted-foreground hover:bg-accent/50 flex min-h-56 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-5 text-sm">
            <Plus className="size-5" />
            New automation
            <span className="text-xs">Comment, story, mention, keyword or follow</span>
          </button>
        </div>
      )}

      {tab === "broadcasts" && (
        <Panel
          title="Broadcasts and campaigns"
          description="Send one message to a group. Sojao answers every reply and closes the sale."
          action={
            <Button size="sm">
              <Send className="size-4" /> New broadcast
            </Button>
          }
        >
          <Table>
            <thead>
              <tr>
                <Th>Campaign</Th>
                <Th>Audience</Th>
                <Th>Status</Th>
                <Th className="text-right">Sent</Th>
                <Th className="text-right">Replies</Th>
                <Th className="text-right">Sales</Th>
              </tr>
            </thead>
            <tbody>
              {broadcasts.map((b) => (
                <tr key={b.id} className="hover:bg-accent/30">
                  <Td>
                    <div className="flex items-center gap-2 font-medium">
                      <ChannelIcon channel={b.channel} className="size-3.5" />
                      {b.name}
                    </div>
                    <p className="text-muted-foreground text-xs">{b.date}</p>
                  </Td>
                  <Td className="text-muted-foreground">{b.audience}</Td>
                  <Td>
                    <Badge
                      tone={
                        b.status === "Sent"
                          ? "good"
                          : b.status === "Scheduled"
                            ? "info"
                            : "neutral"
                      }
                    >
                      {b.status}
                    </Badge>
                  </Td>
                  <Td className="text-right tabular-nums">{b.sent || "—"}</Td>
                  <Td className="text-right tabular-nums">{b.replies || "—"}</Td>
                  <Td className="text-right tabular-nums">
                    {b.sales ? money(b.sales) : "—"}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="text-muted-foreground mt-8 text-xs">
            WhatsApp marketing message fees from Meta are billed at cost.
          </p>
        </Panel>
      )}

      {tab === "sequences" && (
        <div className="grid gap-4 md:grid-cols-3">
          {sequences.map((s) => (
            <div key={s.id} className="bg-card rounded-2xl border p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{s.name}</p>
                <Toggle defaultOn={s.enabled} label={`Turn ${s.name} on or off`} />
              </div>
              <p className="text-muted-foreground mt-2 text-sm">{s.description}</p>
              <div className="mt-4 flex gap-2">
                <Badge>{s.steps} steps</Badge>
                <Badge tone="brand">{s.active} people in it</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "giveaways" &&
        (hasPlan("Pro") ? (
          giveaways.map((g) => <GiveawayCard key={g.id} g={g} />)
        ) : (
          <div className="space-y-4">
            {giveaways.map((g) => (
              <GiveawayCard key={g.id} g={g} />
            ))}
            <Upsell feature="Giveaways and contests" />
          </div>
        ))}

      {tab === "growth" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <GrowthTool icon={Link2} title="Ref link" text="ig.me/m/yourbrand?ref=summer" />
            <GrowthTool icon={QrCode} title="QR code" text="Print it on packaging and flyers" />
            <GrowthTool icon={MessageCircle} title="Website widget" text="Chat bubble for your store" />
            <GrowthTool icon={Megaphone} title="Click-to-DM ads" text="Ads that open a chat with Sojao" />
          </div>
          {!hasPlan("Pro") && <Upsell feature="Growth tools and Click-to-DM ads" />}
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function GiveawayCard({ g }: { g: (typeof giveaways)[number] }) {
  return (
    <div className="bg-card flex flex-wrap items-center gap-4 rounded-2xl border p-5 shadow-xs">
      <span className="bg-brand/12 flex size-12 items-center justify-center rounded-xl">
        <Gift className="size-6" />
      </span>
      <div className="flex-1">
        <p className="font-semibold">{g.name}</p>
        <p className="text-muted-foreground text-sm">{g.rules}</p>
      </div>
      <Badge tone="good">{g.status}</Badge>
      <div className="text-sm">
        <span className="font-semibold tabular-nums">{g.entries}</span>{" "}
        <span className="text-muted-foreground">entries · ends {g.ends}</span>
      </div>
    </div>
  );
}

function GrowthTool({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-card rounded-2xl border p-5 shadow-xs">
      <span className="bg-brand/12 flex size-10 items-center justify-center rounded-xl">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 font-semibold">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm">{text}</p>
      <Button
        size="sm"
        variant="outline"
        className="mt-4"
        onClick={() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

function Upsell({ feature }: { feature: string }) {
  return (
    <div className="from-brand/15 to-card flex flex-wrap items-center gap-4 rounded-2xl border bg-linear-to-r p-5">
      <Lock className="size-5" />
      <p className="flex-1 text-sm">
        <span className="font-semibold">{feature}</span> are on the Pro plan
        ($199/month).
      </p>
      <Button size="sm" asChild>
        <a href="/dashboard/billing">Upgrade to Pro</a>
      </Button>
    </div>
  );
}
