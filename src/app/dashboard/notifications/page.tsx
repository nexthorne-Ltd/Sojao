"use client";

import { useState } from "react";

import { CheckCheck } from "lucide-react";

import { type Notice, NoticeRow, useNotifications } from "@/components/dashboard/notifications";
import { PageHeader, Panel, Tabs } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";

type Filter = "all" | "unread" | Notice["kind"];

export default function NotificationsPage() {
  const { items, error, reload, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<Filter>("all");
  const list = items ?? [];
  const shown = list.filter((n) => (filter === "all" ? true : filter === "unread" ? n.unread : n.kind === filter));

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Chats that need you, new leads, sales and alerts from the last 30 days."
        actions={
          <Button variant="outline" onClick={() => void markAllRead()} disabled={!list.some((n) => n.unread)}>
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
                { id: "unread", label: "Unread", count: list.filter((n) => n.unread).length },
                { id: "handover", label: "Needs you" },
                { id: "lead", label: "Leads" },
                { id: "sale", label: "Sales" },
              ]}
              value={filter}
              onChange={setFilter}
            />
          }
          bodyClassName="p-0"
        >
          <div className="divide-y">
            {error ? (
              <p className="p-6 text-center text-sm">
                {error}{" "}
                <button className="underline" onClick={() => void reload()}>
                  Retry
                </button>
              </p>
            ) : items === null ? (
              <p className="text-muted-foreground p-6 text-center text-sm">Loading…</p>
            ) : shown.length === 0 ? (
              <p className="text-muted-foreground p-6 text-center text-sm">All caught up. 🌙</p>
            ) : (
              shown.map((n) => <NoticeRow key={n.id} n={n} />)
            )}
          </div>
        </Panel>

        <Panel title="Email and push">
          <p className="text-muted-foreground text-sm">
            For now, notifications show here and on the bell at the top of every page. Email and phone notifications are coming soon.
          </p>
        </Panel>
      </div>
    </>
  );
}
