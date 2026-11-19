"use client";

import { useState } from "react";

import { Check, Code2, Copy, Link2, Megaphone, MessageCircle, QrCode, Trash2 } from "lucide-react";

import { inputCls } from "../modal";
import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { Badge, Panel, Table, Td, Th } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, download, type IgAccount } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

type Link = { id: string; name: string; code: string; url: string; campaignTag: string | null; kind: "link" | "widget"; conversationsStarted: number };
type Widget = { key: string; scriptUrl: string; snippet: string; linkUrl: string | null };

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          prompt("Copy this:", text);
        }
      }}
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {done ? "Copied" : label}
    </Button>
  );
}

/** Service 8: tracked ig.me links, QR codes, website widget, ad referrals. */
export function LiveGrowth() {
  const links = useApi<{ links: Link[] }>("/links");
  const widget = useApi<Widget>("/widget");
  const accounts = useApi<{ accounts: IgAccount[] }>("/instagram/accounts").data?.accounts.filter((a) => a.status === "active") ?? [];
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const create = async () => {
    setNotice(null);
    try {
      await api("/links", { method: "POST", body: { igAccountId: accounts[0]!.id, name, ...(tag.trim() ? { campaignTag: tag.trim() } : {}) } });
      setName("");
      setTag("");
      await links.reload();
    } catch (e) {
      setNotice(errorText(e));
    }
  };

  return (
    <div className="space-y-6">
      {notice && <ErrorNote text={notice} />}
      <Panel title="Tracked links" description="Links that open a DM with you. Sojao records which link started each conversation.">
        <div className="mb-5 grid gap-2 sm:grid-cols-[1fr_200px_auto]">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name, e.g. Packaging flyer" aria-label="Link name" />
          <input className={inputCls} value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Campaign tag (optional)" aria-label="Campaign tag" />
          <Button className="h-10" disabled={!name.trim() || accounts.length === 0} onClick={create}>
            <Link2 className="size-4" /> Create link
          </Button>
        </div>
        {links.loading && !links.data ? (
          <Loading />
        ) : links.error ? (
          <ErrorNote text={links.error} onRetry={links.reload} />
        ) : !links.data?.links.length ? (
          <Empty title="No links yet" text="Create one for your bio, packaging, flyers or emails." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Link</Th>
                <Th>Conversations</Th>
                <Th>
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {links.data.links.map((l) => (
                <tr key={l.id}>
                  <Td>
                    <p className="font-medium">{l.name}</p>
                    <div className="mt-1 flex gap-1">
                      {l.kind === "widget" && <Badge tone="info">widget</Badge>}
                      {l.campaignTag && <Badge tone="brand">{l.campaignTag}</Badge>}
                    </div>
                  </Td>
                  <Td className="max-w-64 truncate font-mono text-xs">{l.url}</Td>
                  <Td className="tabular-nums">{l.conversationsStarted}</Td>
                  <Td>
                    <div className="flex flex-wrap justify-end gap-2">
                      <CopyButton text={l.url} />
                      <Button size="sm" variant="outline" onClick={() => download(`/links/${l.id}/qr.svg`, `${l.name}-qr.svg`).catch((e) => setNotice(errorText(e)))}>
                        <QrCode className="size-3.5" /> SVG
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => download(`/links/${l.id}/qr.png`, `${l.name}-qr.png`).catch((e) => setNotice(errorText(e)))}>
                        <QrCode className="size-3.5" /> PNG
                      </Button>
                      {l.kind === "link" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label={`Delete ${l.name}`}
                          onClick={async () => {
                            if (!confirm(`Delete “${l.name}”? The link stops being tracked.`)) return;
                            await api(`/links/${l.id}`, { method: "DELETE" }).catch((e) => setNotice(errorText(e)));
                            await links.reload();
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={<span className="flex items-center gap-2"><Code2 className="size-4" /> Website button</span>} description="A small “Message us on Instagram” button for your site. Not a web chat. No cookies.">
          {widget.loading && !widget.data ? (
            <Loading />
          ) : widget.error ? (
            <ErrorNote text={widget.error} onRetry={widget.reload} />
          ) : (
            <>
              <p className="mb-2 text-sm">Paste this before <code>&lt;/body&gt;</code>:</p>
              <pre className={cn(inputCls, "h-auto overflow-x-auto py-3 font-mono text-xs whitespace-pre-wrap")}>{widget.data!.snippet}</pre>
              <div className="mt-3 flex flex-wrap gap-2">
                <CopyButton text={widget.data!.snippet} label="Copy snippet" />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    if (!confirm("Make a new key? The old snippet stops working.")) return;
                    await api("/widget/rotate", { method: "POST" }).catch((e) => setNotice(errorText(e)));
                    await widget.reload();
                  }}
                >
                  New key
                </Button>
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                Optional: <code>data-label=&quot;Chat with us&quot;</code> and <code>data-position=&quot;left&quot;</code> on the script tag. Works with strict Content-Security-Policy (allow the script URL).
              </p>
              {!widget.data!.linkUrl && <p className="mt-2 text-xs text-amber-700">Connect Instagram first, then the button appears.</p>}
            </>
          )}
        </Panel>

        <Panel title="Ads and WhatsApp">
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <Megaphone className="text-brand mt-0.5 size-5 shrink-0" />
              <span>
                <span className="block font-medium">Click-to-Instagram-Direct ads</span>
                <span className="text-muted-foreground">
                  Create the ad in Meta Ads Manager. When someone messages from it, Sojao saves the ad and its title on the customer. Instagram gives you up to 7 days to reply to people who
                  came from an ad.
                </span>
              </span>
            </li>
            <li className="flex gap-3 opacity-70">
              <MessageCircle className="mt-0.5 size-5 shrink-0" />
              <span>
                <span className="block font-medium">Click-to-WhatsApp</span>
                <span className="text-muted-foreground">Coming later.</span>
              </span>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
