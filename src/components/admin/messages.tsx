"use client";

import { useState } from "react";

import { errText, useAdmin } from "@/components/admin/store";
import { ErrorNote, Loading } from "@/components/dashboard/marketing/live/states";
import { useApi } from "@/components/dashboard/marketing/live/use-api";
import { Badge, PageHeader, Panel, Tabs } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/marketing-api";

type Msg = { id: string; kind: "contact" | "help"; name: string; email: string; company: string | null; topic: string | null; message: string; status: "open" | "closed"; createdAt: string };

/** Website contact form + dashboard "Talk to us" messages. */
export function AdminMessages() {
  const [status, setStatus] = useState<"open" | "closed" | "all">("open");
  const { data, error, reload } = useApi<{ messages: Msg[] }>(`/admin/messages?status=${status}`);
  const { can, notify } = useAdmin();
  const [err, setErr] = useState<string | null>(null);

  const setMsgStatus = async (m: Msg, next: "open" | "closed") => {
    setErr(null);
    try {
      await api(`/admin/messages/${m.id}`, { method: "PATCH", body: { status: next } });
      await reload();
      notify(next === "closed" ? "Marked as done" : "Reopened");
    } catch (e) {
      setErr(errText(e));
    }
  };

  return (
    <>
      <PageHeader title="Messages" description="From the website contact form and the dashboard's “Talk to us”. Reply by email." />
      <Tabs
        className="mb-4"
        tabs={[
          { id: "open", label: "Open" },
          { id: "closed", label: "Done" },
          { id: "all", label: "All" },
        ]}
        value={status}
        onChange={setStatus}
      />
      {err && <p className="mb-3 text-sm text-rose-600">{err}</p>}
      {error ? (
        <ErrorNote text={error} onRetry={reload} />
      ) : !data ? (
        <Loading />
      ) : data.messages.length === 0 ? (
        <Panel>
          <p className="text-muted-foreground text-center text-sm">No messages here.</p>
        </Panel>
      ) : (
        <div className="space-y-3">
          {data.messages.map((m) => (
            <Panel key={m.id}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {m.name}{" "}
                    <a href={`mailto:${m.email}`} className="text-muted-foreground text-sm font-normal underline-offset-4 hover:underline">
                      {m.email}
                    </a>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {m.kind === "contact" ? "Website contact form" : "Dashboard help"}
                    {m.company ? ` · ${m.company}` : ""}
                    {m.topic ? ` · ${m.topic}` : ""} · {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge tone={m.status === "open" ? "warn" : "neutral"}>{m.status === "open" ? "Open" : "Done"}</Badge>
                {can("support") && (
                  <Button size="sm" variant="outline" onClick={() => void setMsgStatus(m, m.status === "open" ? "closed" : "open")}>
                    {m.status === "open" ? "Mark done" : "Reopen"}
                  </Button>
                )}
              </div>
              <p className="mt-3 text-sm whitespace-pre-wrap">{m.message}</p>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
