"use client";

import { useState } from "react";

import { Download, Trash2 } from "lucide-react";

import { RuleHint } from "../meta-rules";
import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { Badge, Panel, Table, Td, Th } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, download, type Lead } from "@/lib/marketing-api";

const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—");

export function LiveLeads() {
  const { data, error, loading, reload } = useApi<{ leads: Lead[] }>("/leads?limit=500");
  const [notice, setNotice] = useState<string | null>(null);

  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  const leads = data?.leads ?? [];

  const remove = async (l: Lead) => {
    if (!confirm(`Delete all data for ${l.name ?? l.username ?? "this person"}? This can't be undone.`)) return;
    try {
      await api(`/customers/${l.id}`, { method: "DELETE" });
      await reload();
    } catch (e) {
      setNotice(errorText(e));
    }
  };

  return (
    <Panel
      title="Leads"
      description="People who shared their name, email or phone in a DM."
      action={
        <Button
          size="sm"
          variant="outline"
          disabled={leads.length === 0}
          onClick={() => download("/leads/export.csv", `leads-${new Date().toISOString().slice(0, 10)}.csv`).catch((e) => setNotice(errorText(e)))}
        >
          <Download className="size-4" /> Export CSV
        </Button>
      }
    >
      {notice && <div className="mb-4"><ErrorNote text={notice} /></div>}
      {leads.length === 0 ? (
        <Empty title="No leads yet" text="Turn on “Then ask for name, email and phone” in an automation to start collecting leads." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Source</Th>
              <Th>Consent</Th>
              <Th>Last message</Th>
              <Th>
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <Td>
                  <p className="font-medium">{l.name ?? "—"}</p>
                  {l.username && <p className="text-muted-foreground text-xs">@{l.username}</p>}
                </Td>
                <Td>{l.email ?? "—"}</Td>
                <Td className="tabular-nums">{l.phone ?? "—"}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {l.source && <Badge>{l.source.replace("_", " ")}</Badge>}
                    {l.optedOut && <Badge tone="warn">opted out</Badge>}
                  </div>
                </Td>
                <Td>{l.consentAt ? <Badge tone="good">{fmt(l.consentAt)}</Badge> : "—"}</Td>
                <Td>{fmt(l.lastInboundAt)}</Td>
                <Td className="text-right">
                  <Button size="sm" variant="ghost" aria-label={`Delete ${l.name ?? l.username ?? "lead"}`} onClick={() => remove(l)}>
                    <Trash2 className="size-4" />
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <RuleHint className="mt-6">Deleting a lead removes their messages and history too. Exports are for your own use. Don&apos;t share them.</RuleHint>
    </Panel>
  );
}
