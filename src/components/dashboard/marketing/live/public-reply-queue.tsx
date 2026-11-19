"use client";

import { useState } from "react";

import { AlertTriangle, Check, X } from "lucide-react";

import { inputCls } from "../modal";
import { errorText, useApi } from "./use-api";

import { Badge, Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/marketing-api";

type Reply = { id: string; commentText: string; text: string | null; category: string | null; language: string | null; createdAt: string };
type Alert = { id: number; createdAt: string; payload: { kind: string; text?: string } };

/** Service 10: public replies waiting for approval + owner alerts (spam / abuse / negative comments). */
export function PublicReplyQueue() {
  const pending = useApi<{ replies: Reply[] }>("/public-replies?status=pending_approval");
  const alerts = useApi<{ alerts: Alert[] }>("/alerts");
  const [edit, setEdit] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const decide = async (r: Reply, action: "approve" | "reject") => {
    setNotice(null);
    try {
      const res = await api<{ status: string; reason?: string }>(`/public-replies/${r.id}/${action}`, {
        method: "POST",
        body: action === "approve" && edit[r.id] !== undefined ? { text: edit[r.id] } : {},
      });
      if (action === "approve" && res.status !== "posted") setNotice(`Not posted: ${(res.reason ?? res.status).replaceAll("_", " ")}`);
      await pending.reload();
    } catch (e) {
      setNotice(errorText(e));
    }
  };

  const items = pending.data?.replies ?? [];
  const recentAlerts = (alerts.data?.alerts ?? []).slice(0, 5);
  if (!items.length && !recentAlerts.length) return null;

  return (
    <div className="mb-6 grid gap-6 xl:grid-cols-2">
      {items.length > 0 && (
        <Panel title={`Public replies to approve (${items.length})`} description="Nothing is posted under a comment until you approve it.">
          {notice && <p className="mb-3 text-sm text-rose-600">{notice}</p>}
          <ul className="space-y-4">
            {items.map((r) => (
              <li key={r.id} className="rounded-xl border p-3">
                <p className="text-muted-foreground text-xs">
                  Comment{r.language && r.language !== "und" ? ` (${r.language})` : ""}: “{r.commentText}”
                </p>
                <input
                  className={`${inputCls} mt-2`}
                  value={edit[r.id] ?? r.text ?? ""}
                  maxLength={300}
                  onChange={(e) => setEdit({ ...edit, [r.id]: e.target.value })}
                  aria-label="Public reply text"
                />
                <div className="mt-2 flex items-center gap-2">
                  {r.category && <Badge>{r.category.replace("_", " ")}</Badge>}
                  <span className="flex-1" />
                  <Button size="sm" variant="ghost" onClick={() => decide(r, "reject")}>
                    <X className="size-3.5" /> Reject
                  </Button>
                  <Button size="sm" onClick={() => decide(r, "approve")}>
                    <Check className="size-3.5" /> Post reply
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      {recentAlerts.length > 0 && (
        <Panel title="Comments that need you" description="Sojao never replies publicly to spam, insults or complaints. Handle these yourself.">
          <ul className="space-y-3 text-sm">
            {recentAlerts.map((a) => (
              <li key={a.id} className="flex gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <span>
                  <Badge tone={a.payload.kind === "comment_negative" ? "warn" : "bad"}>{a.payload.kind.replace("comment_", "")}</Badge>{" "}
                  <span className="text-muted-foreground">“{a.payload.text}”</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
