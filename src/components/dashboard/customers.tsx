"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { Download, MessageCircle, Search, X } from "lucide-react";

import {
  Avatar,
  Badge,
  ChannelIcon,
  PageHeader,
  Panel,
  Table,
  Td,
  Th,
  money,
} from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import {
  conversations,
  customers,
  orders,
} from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const allTags = Array.from(new Set(customers.flatMap((c) => c.tags)));

export function CustomersView({ initialId }: { initialId: string | null }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const selected = customers.find((c) => c.id === selectedId);

  const list = useMemo(
    () =>
      customers.filter(
        (c) =>
          (!tag || c.tags.includes(tag)) &&
          (q === "" ||
            `${c.name} ${c.handle} ${c.email ?? ""} ${c.city}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [q, tag],
  );

  const select = (id: string | null) => {
    setSelectedId(id);
    window.history.replaceState(
      null,
      "",
      id ? `/dashboard/customers?c=${id}` : "/dashboard/customers",
    );
  };

  return (
    <>
      <PageHeader
        title="Customers"
        description="One memory for every customer, across Instagram, Messenger and WhatsApp."
        actions={
          <Button variant="outline">
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="bg-card flex h-10 min-w-60 flex-1 items-center gap-2 rounded-xl border px-3 text-sm md:max-w-sm">
          <Search className="text-muted-foreground size-4" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, handle, email or city"
            className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTag(null)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              !tag ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-accent",
            )}
          >
            All · {customers.length}
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(tag === t ? null : t)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                tag === t ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-accent",
              )}
            >
              {t} · {customers.filter((c) => c.tags.includes(t)).length}
            </button>
          ))}
        </div>
      </div>

      <Panel>
        <Table>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>App</Th>
              <Th>Tags</Th>
              <Th className="text-right">Orders</Th>
              <Th className="text-right">Spent</Th>
              <Th>Last seen</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr
                key={c.id}
                onClick={() => select(c.id)}
                className={cn(
                  "hover:bg-accent/30 cursor-pointer",
                  c.id === selectedId && "bg-accent/40",
                )}
              >
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} />
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-muted-foreground text-xs">{c.handle}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <ChannelIcon channel={c.channel} withLabel />
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </Td>
                <Td className="text-right tabular-nums">{c.orders}</Td>
                <Td className="text-right tabular-nums">{money(c.spent)}</Td>
                <Td className="text-muted-foreground">{c.lastSeen}</Td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <Td className="text-muted-foreground text-center" >
                  No customers match.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Panel>

      {/* Drawer */}
      {selected && (
        <>
          <button
            aria-label="Close"
            className="fixed inset-0 z-50 bg-black/30"
            onClick={() => select(null)}
          />
          <aside className="bg-background fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} className="size-12 text-sm" />
                <div>
                  <p className="font-semibold">{selected.name}</p>
                  <p className="text-muted-foreground text-sm">{selected.city}</p>
                </div>
              </div>
              <button
                onClick={() => select(null)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Mini label="Orders" value={String(selected.orders)} />
              <Mini label="Spent" value={money(selected.spent)} />
              <Mini label="Last seen" value={selected.lastSeen} />
            </div>

            <Section title="Contact">
              <p className="flex items-center gap-2 text-sm">
                <ChannelIcon channel={selected.channel} /> {selected.handle}
              </p>
              {selected.email && <p className="text-muted-foreground text-sm">{selected.email}</p>}
              {selected.phone && <p className="text-muted-foreground text-sm">{selected.phone}</p>}
            </Section>

            <Section title="Tags">
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
                <button className="text-muted-foreground rounded-full border border-dashed px-2 py-0.5 text-xs">
                  + Add tag
                </button>
              </div>
            </Section>

            <Section title="What Sojao remembers">
              <p className="bg-muted rounded-xl p-3 text-sm">
                {selected.notes || "Nothing yet. Sojao learns from every chat."}
              </p>
            </Section>

            <Section title="Orders">
              {orders.filter((o) => o.customerId === selected.id).length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders yet.</p>
              ) : (
                <ul className="space-y-2">
                  {orders
                    .filter((o) => o.customerId === selected.id)
                    .map((o) => (
                      <li key={o.id} className="flex justify-between rounded-xl border p-3 text-sm">
                        <span>
                          <span className="font-medium">{o.id}</span>{" "}
                          <span className="text-muted-foreground">{o.items}</span>
                        </span>
                        <span className="tabular-nums">{money(o.total)}</span>
                      </li>
                    ))}
                </ul>
              )}
            </Section>

            <Section title="Chats">
              {conversations
                .filter((v) => v.customerId === selected.id)
                .map((v) => (
                  <Link
                    key={v.id}
                    href={`/dashboard/inbox?c=${v.id}`}
                    className="hover:bg-accent/50 flex items-center gap-2 rounded-xl border p-3 text-sm"
                  >
                    <MessageCircle className="size-4" />
                    <span className="flex-1 truncate">{v.preview}</span>
                    <span className="text-muted-foreground text-xs">{v.time}</span>
                  </Link>
                ))}
            </Section>
          </aside>
        </>
      )}
    </>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted rounded-xl p-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 space-y-2">
      <p className="text-muted-foreground text-xs font-medium uppercase">{title}</p>
      {children}
    </div>
  );
}
