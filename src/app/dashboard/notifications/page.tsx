"use client";

import { useState } from "react";

import { CheckCheck } from "lucide-react";

import { NoticeRow } from "@/components/dashboard/notifications";
import { PageHeader, Panel, Tabs, Toggle } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { type Notice, notifications } from "@/lib/dashboard-data";

type Filter = "all" | "unread" | Notice["kind"];

const PREFS = [
  { label: "A chat needs you", text: "When Sojao hands a chat over", email: true, push: true },
  { label: "New sale from a DM", text: "Each time someone pays from a checkout link", email: false, push: true },
  { label: "Night shift summary", text: "Every morning at 8 AM", email: true, push: false },
  { label: "Weekly report", text: "Every Monday", email: true, push: false },
  { label: "New leads", text: "From comment and story automations", email: false, push: false },
];

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);
  const [filter, setFilter] = useState<Filter>("all");
  const shown = items.filter((n) =>
    filter === "all" ? true : filter === "unread" ? n.unread : n.kind === filter,
  );

  return (
    <>
      <PageHeader
        title="Notifications"
        description="What Sojao wants you to know, and how you'd like to hear about it."
        actions={
          <Button
            variant="outline"
            onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))}
          >
            <CheckCheck className="size-4" /> Mark all read
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel
          title="All notifications"
          action={
            <Tabs
              tabs={[
                { id: "all", label: "All" },
                { id: "unread", label: "Unread", count: items.filter((n) => n.unread).length },
                { id: "handover", label: "Needs you" },
                { id: "sale", label: "Sales" },
              ]}
              value={filter}
              onChange={setFilter}
            />
          }
          bodyClassName="p-0"
        >
          <div className="divide-y">
            {shown.length === 0 ? (
              <p className="text-muted-foreground p-6 text-center text-sm">All caught up. 🌙</p>
            ) : (
              shown.map((n) => <NoticeRow key={n.id} n={n} />)
            )}
          </div>
        </Panel>

        <Panel title="How to notify you" bodyClassName="p-0">
          <div className="text-muted-foreground grid grid-cols-[1fr_auto_auto] gap-x-6 border-b px-5 py-2 text-xs font-medium uppercase">
            <span>Event</span>
            <span>Email</span>
            <span>Push</span>
          </div>
          <ul className="divide-y">
            {PREFS.map((p) => (
              <li key={p.label} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-6 px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-muted-foreground text-xs">{p.text}</p>
                </div>
                <Toggle defaultOn={p.email} label={`${p.label} by email`} />
                <Toggle defaultOn={p.push} label={`${p.label} by push`} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
