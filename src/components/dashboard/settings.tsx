"use client";

import { useState } from "react";

import { Check, Plus, Store, Trash2, Upload } from "lucide-react";

import {
  Badge,
  ChannelIcon,
  PageHeader,
  Panel,
  Tabs,
  Toggle,
} from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { type Channel, brand } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

type Tab = "channels" | "store" | "ai" | "billing" | "team";
const TABS: { id: Tab; label: string }[] = [
  { id: "channels", label: "Channels" },
  { id: "store", label: "Store" },
  { id: "ai", label: "Train Sojao" },
  { id: "team", label: "Team" },
];

export function SettingsView({ initialTab }: { initialTab?: string }) {
  const initial = (initialTab as Tab) || "channels";
  const [tab, setTab] = useState<Tab>(
    TABS.some((t) => t.id === initial) ? initial : "channels",
  );

  return (
    <>
      <PageHeader
        title="Settings"
        description="Connect your apps and store, teach Sojao about your brand, and manage your team."
      />
      <Tabs
        className="mb-6"
        tabs={TABS}
        value={tab}
        onChange={(t) => {
          setTab(t);
          window.history.replaceState(null, "", `/dashboard/settings?tab=${t}`);
        }}
      />
      {tab === "channels" && <Channels />}
      {tab === "store" && <StoreTab />}
      {tab === "ai" && <TrainTab />}
      {tab === "team" && <Team />}
    </>
  );
}

/* ---------------- Channels ---------------- */
function Channels() {
  const [connected, setConnected] = useState<Record<Channel, string | null>>({
    instagram: "@yourbrand",
    messenger: "Your Brand Page",
    whatsapp: null,
  });
  const info: Record<Channel, string> = {
    instagram: "DMs, comments, story replies and mentions",
    messenger: "Messages to your Facebook Page",
    whatsapp: "Chats, order updates and broadcasts",
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {(Object.keys(connected) as Channel[]).map((ch) => (
        <div key={ch} className="bg-card flex flex-col rounded-2xl border p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <ChannelIcon channel={ch} withLabel className="size-6" />
            {connected[ch] ? <Badge tone="good">Connected</Badge> : <Badge>Not connected</Badge>}
          </div>
          <p className="text-muted-foreground mt-3 flex-1 text-sm">{info[ch]}</p>
          {connected[ch] && <p className="mt-3 text-sm font-medium">{connected[ch]}</p>}
          <Button
            className="mt-4"
            variant={connected[ch] ? "outline" : "default"}
            onClick={() =>
              setConnected((p) => ({
                ...p,
                [ch]: p[ch] ? null : ch === "whatsapp" ? "+1 (555) 010-0000" : "Connected account",
              }))
            }
          >
            {connected[ch] ? "Disconnect" : `Connect ${ch === "whatsapp" ? "WhatsApp" : ""}`.trim()}
          </Button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Store ---------------- */
function StoreTab() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Shopify" description="Sojao reads products, stock, prices and orders. It never changes your store.">
        <div className="flex items-center gap-3">
          <span className="bg-brand/12 flex size-11 items-center justify-center rounded-xl">
            <Store className="size-5" />
          </span>
          <div className="flex-1">
            <p className="font-medium">[yourbrand].myshopify.com</p>
            <p className="text-muted-foreground text-xs">Last synced 4 minutes ago · 6 products · 7 orders</p>
          </div>
          <Badge tone="good">Connected</Badge>
        </div>
        <div className="mt-5 space-y-3 border-t pt-5 text-sm">
          <Pref label="Answer “where is my order?” from live order data" on />
          <Pref label="Only suggest products that are in stock" on />
          <Pref label="Send checkout links that add the item to cart" on />
        </div>
      </Panel>

      <Panel title="No Shopify?" description="Sojao works without it. Upload your products and it will sell from that list.">
        <label className="hover:bg-accent/40 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center text-sm">
          <Upload className="size-5" />
          <span className="font-medium">Upload a product list (CSV)</span>
          <span className="text-muted-foreground text-xs">Name, price, sizes, stock and link</span>
          <input type="file" accept=".csv" className="sr-only" />
        </label>
      </Panel>
    </div>
  );
}

/* ---------------- Train Sojao ---------------- */
function TrainTab() {
  const [saved, setSaved] = useState(false);
  const [faqs, setFaqs] = useState([
    { q: "Do you ship internationally?", a: "Yes, to the US, UK, Canada and Australia." },
    { q: "Do you offer gift wrap?", a: "Yes, for $4 at checkout." },
  ]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className="grid gap-6 xl:grid-cols-2"
    >
      <Panel title="Your brand" description="Sojao uses this to sound like you.">
        <div className="space-y-4">
          <Field label="Brand name">
            <input defaultValue={brand.name} className={inputCls} />
          </Field>
          <Field label="Tone of voice">
            <select defaultValue="Friendly" className={inputCls}>
              <option>Friendly</option>
              <option>Calm and premium</option>
              <option>Playful</option>
              <option>Short and simple</option>
            </select>
          </Field>
          <Field label="About your brand">
            <textarea
              rows={4}
              defaultValue="[Describe what you sell, who it's for and what makes it special.]"
              className={cn(inputCls, "h-auto py-2")}
            />
          </Field>
          <Field label="Shipping">
            <textarea rows={2} defaultValue="Free shipping over $75. 2–4 business days in the US." className={cn(inputCls, "h-auto py-2")} />
          </Field>
          <Field label="Returns">
            <textarea rows={2} defaultValue="Free returns within 30 days, unworn with tags." className={cn(inputCls, "h-auto py-2")} />
          </Field>
        </div>
      </Panel>

      <div className="space-y-6">
        <Panel
          title="Common questions"
          description="Add answers you give often. Sojao also learns from your replies."
          action={
            <Button type="button" size="sm" variant="outline" onClick={() => setFaqs([...faqs, { q: "", a: "" }])}>
              <Plus className="size-4" /> Add
            </Button>
          }
        >
          <ul className="space-y-3">
            {faqs.map((f, i) => (
              <li key={i} className="space-y-2 rounded-xl border p-3">
                <div className="flex gap-2">
                  <input
                    value={f.q}
                    onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))}
                    placeholder="Question"
                    className={cn(inputCls, "font-medium")}
                  />
                  <button
                    type="button"
                    onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Remove question"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <textarea
                  value={f.a}
                  onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))}
                  placeholder="Answer"
                  rows={2}
                  className={cn(inputCls, "h-auto py-2")}
                />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="When to hand over to you" description="Sojao passes the chat to you in these cases.">
          <div className="space-y-3 text-sm">
            <Pref label="Refund requests" on />
            <Pref label="Custom orders and special requests" on />
            <Pref label="Upset customers" on />
            <Pref label="Any time Sojao isn't sure" on />
            <Pref label="Orders over $300" />
          </div>
        </Panel>

        <div className="flex justify-end">
          <Button type="submit">
            {saved ? (
              <>
                <Check className="size-4" /> Saved
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

/* ---------------- Team ---------------- */
function Team() {
  const [members, setMembers] = useState([{ email: brand.owner, role: "Owner" }]);
  const [email, setEmail] = useState("");
  return (
    <Panel title="Team" description="Invite people who can reply to chats when Sojao hands them over.">
      <ul className="divide-y rounded-xl border">
        {members.map((m) => (
          <li key={m.email} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{m.email}</span>
            <Badge>{m.role}</Badge>
          </li>
        ))}
      </ul>
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.trim()) return;
          setMembers([...members, { email: email.trim(), role: "Invited" }]);
          setEmail("");
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teammate@yourbrand.com"
          className={cn(inputCls, "flex-1")}
        />
        <Button type="submit">Send invite</Button>
      </form>
    </Panel>
  );
}

/* ---------------- helpers ---------------- */
const inputCls =
  "bg-background focus-visible:ring-ring/50 h-10 w-full rounded-xl border px-3 text-sm outline-none focus-visible:ring-[3px]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function Pref({ label, on = false }: { label: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <Toggle defaultOn={on} label={label} />
    </div>
  );
}
