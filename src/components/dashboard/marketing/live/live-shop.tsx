"use client";

import { useEffect, useState } from "react";

import { Archive, ArchiveRestore, Bell, Check, Copy, Link2, Pencil, Plus, RefreshCw, Store, Trash2, Unplug, Upload } from "lucide-react";

import { inputCls } from "../modal";
import { DiscountsPanel, QuizzesPanel, SurveysPanel } from "./live-shop-editors";
import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { BarChart } from "@/components/dashboard/bar-chart";
import { Badge, Panel, StatCard, Table, Tabs, Td, Th } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

type Variant = { id: string; externalId: string; title: string; price: string; currency: string; stock: number | null };
type Product = { id: string; title: string; url: string | null; status: string; tags: string[]; source: string; variants: Variant[] };
type Store = { provider: string; shop?: string; status?: string; statusReason?: string | null; lastSyncedAt?: string | null; currency?: string | null; oauthAvailable?: boolean };
type AlertSummary = { byStatus: { status: string; type: string; n: number }[]; waitingByProduct: { productId: string; title: string; n: number }[] };
type ShortLink = { id: string; slug: string; shortUrl: string; destination: string; status: string; source: string | null; createdAt: string };
type LinkStats = { total: number; unique: number; byDay: { day: string; total: number; unique: number }[]; countries: { country: string | null; total: number }[] };
type Field = { key: string; label: string; type: string; options: string[]; required: boolean };

type View = "catalog" | "discounts" | "quizzes" | "surveys" | "links" | "fields" | "checkout";
const VIEWS: View[] = ["catalog", "checkout", "discounts", "quizzes", "surveys", "links", "fields"];

/** Services 11-15, 19 and the checkout-link builder (20). */
export function LiveShop() {
  const [view, setView] = useState<View>("catalog");
  // Deep link (?shop=quizzes). Read after mount so server and client render the same first frame.
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("shop") as View | null;
    if (v && VIEWS.includes(v)) setView(v);
  }, []);
  return (
    <div className="space-y-4">
      <Tabs
        className="flex-wrap"
        tabs={[
          { id: "catalog", label: "Store and catalog" },
          { id: "checkout", label: "Checkout links" },
          { id: "discounts", label: "Discount codes" },
          { id: "quizzes", label: "Product quizzes" },
          { id: "surveys", label: "Surveys" },
          { id: "links", label: "Short links" },
          { id: "fields", label: "Custom fields" },
        ]}
        value={view}
        onChange={setView}
      />
      {view === "catalog" && <Catalog />}
      {view === "checkout" && <CheckoutLinks />}
      {view === "discounts" && <DiscountsPanel />}
      {view === "quizzes" && <QuizzesPanel />}
      {view === "surveys" && <SurveysPanel />}
      {view === "links" && <Links />}
      {view === "fields" && <Fields />}
    </div>
  );
}

const fmt = (v: Variant) => new Intl.NumberFormat("en-US", { style: "currency", currency: v.currency }).format(Number(v.price));

/* ---------------------------------------------------------------- store connection */

function StoreConnection({ store, reload, onSynced }: { store: Store; reload: () => Promise<void>; onSynced: () => void }) {
  const [shop, setShop] = useState("");
  const [token, setToken] = useState("");
  const [secret, setSecret] = useState("");
  const [mode, setMode] = useState<"oauth" | "token">(store.oauthAvailable ? "oauth" : "token");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setErr(null);
    try {
      await fn();
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  if (store.provider === "shopify") {
    return (
      <Panel
        title={
          <span className="flex items-center gap-2">
            <Store className="size-4" /> Shopify: {store.shop}
            <Badge tone={store.status === "active" ? "good" : "bad"}>{store.status}</Badge>
          </span>
        }
        description={`Last synced ${store.lastSyncedAt ? new Date(store.lastSyncedAt).toLocaleString() : "never"}. Products, stock, orders and refunds update by webhook; a full sync also runs every 6 hours.`}
        action={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  const r = await api<Record<string, unknown>>("/store/sync", { method: "POST" });
                  setNote(`Synced: ${Object.entries(r).map(([k, v]) => `${v} ${k}`).join(", ")}`);
                  await reload();
                  onSynced();
                })
              }
            >
              <RefreshCw className="size-4" /> Sync now
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => {
                if (!window.confirm("Disconnect Shopify? Your catalog stays, but it stops updating and Shopify discount codes stop working.")) return;
                void run(async () => {
                  await api("/store", { method: "DELETE" });
                  await reload();
                });
              }}
            >
              <Unplug className="size-4" /> Disconnect
            </Button>
          </div>
        }
      >
        {store.statusReason && <p className="mb-2 text-sm text-rose-600">{store.statusReason}</p>}
        {note && <p className="text-muted-foreground text-sm">{note}</p>}
        {err && <ErrorNote text={err} />}
      </Panel>
    );
  }

  return (
    <Panel
      title={
        <span className="flex items-center gap-2">
          <Store className="size-4" /> Connect Shopify
        </span>
      }
      description="Sojao reads products, stock and orders, and can create single-use discount codes. Without Shopify you can still import a CSV catalog below."
    >
      <Tabs
        className="mb-4"
        tabs={[
          ...(store.oauthAvailable ? [{ id: "oauth" as const, label: "Install the app" }] : []),
          { id: "token" as const, label: "Paste an access token" },
        ]}
        value={mode}
        onChange={setMode}
      />
      {mode === "oauth" ? (
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              const { url } = await api<{ url: string }>("/store/shopify/install", { method: "POST", body: { shop } });
              window.location.href = url;
            });
          }}
        >
          <input required value={shop} onChange={(e) => setShop(e.target.value)} placeholder="your-store.myshopify.com" aria-label="Shop domain" className={cn(inputCls, "sm:w-80")} />
          <Button type="submit" disabled={busy}>
            Continue to Shopify
          </Button>
        </form>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              await api("/store/shopify/token", { method: "POST", body: { shop, accessToken: token, ...(secret.trim() ? { webhookSecret: secret.trim() } : {}) } });
              setToken("");
              setSecret("");
              await reload();
              onSynced();
            });
          }}
        >
          <p className="text-muted-foreground text-xs">
            For an existing custom app made in the Shopify admin (new ones can no longer be created there). It needs read_products, read_inventory, read_orders and write_discounts. The token is encrypted
            before it is stored.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <input required value={shop} onChange={(e) => setShop(e.target.value)} placeholder="your-store.myshopify.com" aria-label="Shop domain" className={inputCls} />
            <input required type="password" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Admin API access token (shpat_…)" aria-label="Access token" className={inputCls} />
            <input type="password" autoComplete="off" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="App API secret (to verify webhooks)" aria-label="Webhook secret" className={cn(inputCls, "sm:col-span-2")} />
          </div>
          <Button type="submit" disabled={busy}>
            Connect
          </Button>
        </form>
      )}
      {err && <div className="mt-3"><ErrorNote text={err} /></div>}
    </Panel>
  );
}

function CsvImport({ onDone }: { onDone: () => void }) {
  const [csv, setCsv] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <Panel title="Import products from CSV" description="Columns: product_id, title, variant_id, variant_title, sku, price, currency, stock, url, image_url, tags (separated by ;), and attr:<name> columns.">
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const r = await api<Record<string, unknown>>("/products/import", { method: "POST", body: { csv, currency } });
            const errs = Array.isArray(r.errors) ? r.errors.length : 0;
            setNote(`Imported. ${Object.entries(r).filter(([k]) => k !== "errors").map(([k, v]) => `${k}: ${String(v)}`).join(", ")}${errs ? `, ${errs} rows with errors` : ""}`);
            setCsv("");
            setFile(null);
            onDone();
          } catch (x) {
            setNote(errorText(x));
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="hover:bg-muted flex h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm">
          <Upload className="size-4" /> {file ?? "Choose CSV"}
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setFile(f.name);
              setCsv(await f.text());
            }}
          />
        </label>
        <input aria-label="Default currency" value={currency} maxLength={3} onChange={(e) => setCurrency(e.target.value.toUpperCase())} className={cn(inputCls, "w-20")} />
        <Button type="submit" disabled={!csv || busy}>
          Import
        </Button>
        {note && <span className="text-muted-foreground text-xs">{note}</span>}
      </form>
    </Panel>
  );
}

function Catalog() {
  const store = useApi<Store>("/store");
  const products = useApi<{ products: Product[] }>("/products");
  const alerts = useApi<AlertSummary>("/alerts/summary");
  const settings = useApi<{ priceDropPercent: number }>("/alerts/settings");
  const [drop, setDrop] = useState("10");
  const [note, setNote] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  useEffect(() => {
    if (settings.data) setDrop(String(settings.data.priceDropPercent));
  }, [settings.data]);

  if (products.error) return <ErrorNote text={products.error} onRetry={products.reload} />;
  if (!products.data || !store.data) return <Loading />;
  const n = (status: string) => alerts.data?.byStatus.filter((b) => b.status === status).reduce((s, b) => s + b.n, 0) ?? 0;
  const waiting = new Map(alerts.data?.waitingByProduct.map((w) => [w.productId, w.n]) ?? []);
  const list = products.data.products.filter((p) => showArchived || p.status === "active");
  const archivedCount = products.data.products.length - products.data.products.filter((p) => p.status === "active").length;

  return (
    <>
      <StoreConnection store={store.data} reload={store.reload} onSynced={() => void products.reload()} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Products" value={String(products.data.products.length - archivedCount)} hint={archivedCount ? `${archivedCount} archived` : undefined} />
        <StatCard label="Waiting for an alert" value={String(n("active") + n("triggered"))} hint="Back in stock or price drop" />
        <StatCard label="Alerts sent" value={String(n("sent"))} />
      </div>
      <Panel
        title="Products"
        description="Sojao only quotes prices and stock from here. People who ask about a sold-out item get a “Notify me” button."
        action={
          <form
            className="flex flex-wrap items-center gap-2 text-xs"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api("/alerts/settings", { method: "PATCH", body: { priceDropPercent: Number(drop) } });
                setNote("Saved.");
              } catch (err) {
                setNote(errorText(err));
              }
            }}
          >
            <label htmlFor="drop">Price-drop alert at</label>
            <input id="drop" type="number" min={1} max={90} value={drop} onChange={(e) => setDrop(e.target.value)} className={cn(inputCls, "h-8 w-16")} />% off
            <Button size="sm" variant="outline" type="submit">
              Save
            </Button>
            {note && <span className="text-muted-foreground">{note}</span>}
          </form>
        }
      >
        {archivedCount > 0 && (
          <label className="text-muted-foreground mb-3 flex items-center gap-2 text-xs">
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Show archived
          </label>
        )}
        {list.length === 0 ? (
          <Empty title="No products" text="Connect Shopify above or import a CSV below." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Price</Th>
                <Th>Stock</Th>
                <Th>Waiting for alert</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const stock = p.variants.reduce<number | null>((s, v) => (v.stock === null || s === null ? null : s + v.stock), 0);
                const cheapest = p.variants.length ? p.variants.reduce((a, b) => (Number(a.price) <= Number(b.price) ? a : b)) : null;
                const archived = p.status !== "active";
                return (
                  <tr key={p.id} className={cn(archived && "opacity-60")}>
                    <Td className="font-medium">
                      {p.title} {p.source === "shopify" && <Badge className="ml-1">Shopify</Badge>}
                    </Td>
                    <Td className="tabular-nums">{cheapest ? fmt(cheapest) : "—"}</Td>
                    <Td>{stock === null ? "Not tracked" : stock > 0 ? stock : <Badge tone="bad">Sold out</Badge>}</Td>
                    <Td>
                      {waiting.get(p.id) ? (
                        <Badge tone="info">
                          <Bell className="size-3" /> {waiting.get(p.id)}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </Td>
                    <Td className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        title={archived ? "Show to customers again" : "Hide from quizzes, alerts and the AI"}
                        onClick={async () => {
                          await api(`/products/${p.id}`, { method: "PATCH", body: { status: archived ? "active" : "archived" } }).catch((e) => setNote(errorText(e)));
                          await products.reload();
                        }}
                      >
                        {archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />} {archived ? "Restore" : "Archive"}
                      </Button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Panel>
      {store.data.provider !== "shopify" && <CsvImport onDone={() => void products.reload()} />}
    </>
  );
}

/* ---------------------------------------------------------------- checkout links */

function CheckoutLinks() {
  const products = useApi<{ products: Product[] }>("/products");
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(1);
  const [code, setCode] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const variants = products.data?.products.filter((p) => p.status === "active").flatMap((p) => p.variants.map((v) => ({ ...v, label: `${p.title} · ${v.title} · ${fmt(v)}` }))) ?? [];
  return (
    <Panel title="Checkout link" description="A Shopify cart link with the items (and optional code) filled in. Orders from it are matched to Instagram automatically. Needs Shopify connected.">
      <form
        className="grid gap-3 sm:grid-cols-[1fr_90px_180px_auto]"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          setUrl(null);
          setCopied(false);
          try {
            const r = await api<{ url: string }>("/attribution/checkout-links", { method: "POST", body: { items: [{ variantId, quantity: qty }], ...(code.trim() ? { discountCode: code.trim() } : {}) } });
            setUrl(r.url);
          } catch (x) {
            setErr(errorText(x));
          }
        }}
      >
        <select aria-label="Product" required value={variantId} onChange={(e) => setVariantId(e.target.value)} className={inputCls}>
          <option value="">Choose a product…</option>
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
        <input aria-label="Quantity" type="number" min={1} max={20} value={qty} onChange={(e) => setQty(Number(e.target.value))} className={inputCls} />
        <input aria-label="Discount code (optional)" placeholder="Code (optional)" value={code} onChange={(e) => setCode(e.target.value)} className={inputCls} />
        <Button type="submit" disabled={!variantId}>
          <Link2 className="size-4" /> Build
        </Button>
      </form>
      {err && <div className="mt-3"><ErrorNote text={err} /></div>}
      {url && (
        <div className="bg-muted/50 mt-3 flex items-center gap-2 rounded-xl border p-3 text-sm">
          <code className="flex-1 truncate">{url}</code>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              void navigator.clipboard.writeText(url);
              setCopied(true);
            }}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />} Copy
          </Button>
        </div>
      )}
    </Panel>
  );
}

/* ---------------------------------------------------------------- short links (service 11) */

function Links() {
  const { data, error, reload } = useApi<{ links: ShortLink[] }>("/short-links");
  const [url, setUrl] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  return (
    <>
      <Panel title="Short links" description="Tracked links. Clicks from link previews and bots aren't counted; IPs are hashed, never stored.">
        <form
          className="mb-4 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            try {
              await api("/short-links", { method: "POST", body: { url } });
              setUrl("");
              await reload();
            } catch (x) {
              setErr(errorText(x));
            }
          }}
        >
          <input type="url" required placeholder="https://yourshop.com/products/…" aria-label="Destination URL" value={url} onChange={(e) => setUrl(e.target.value)} className={inputCls} />
          <Button type="submit">
            <Plus className="size-4" /> Shorten
          </Button>
        </form>
        {err && <ErrorNote text={err} />}
        {!data ? (
          <Loading />
        ) : data.links.length === 0 ? (
          <p className="text-muted-foreground text-sm">No links yet. Links in your messages are shortened automatically when that setting is on.</p>
        ) : (
          <ul className="divide-y text-sm">
            {data.links.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-2 py-2">
                <code className="font-medium">{l.shortUrl}</code>
                <span className="text-muted-foreground min-w-0 flex-1 truncate">{l.destination}</span>
                <Badge tone={l.status === "active" ? "good" : "neutral"}>{l.status}</Badge>
                <Button size="sm" variant="ghost" onClick={() => setOpen(open === l.id ? null : l.id)}>
                  Stats
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await api(`/short-links/${l.id}`, { method: "PATCH", body: { status: l.status === "active" ? "disabled" : "active" } }).catch((e) => setErr(errorText(e)));
                    await reload();
                  }}
                >
                  {l.status === "active" ? "Disable" : "Enable"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      {open && <LinkStatsPanel id={open} />}
    </>
  );
}

function LinkStatsPanel({ id }: { id: string }) {
  const { data, error } = useApi<LinkStats & { link: ShortLink }>(`/short-links/${id}/stats`);
  if (error) return <ErrorNote text={error} />;
  if (!data) return <Loading />;
  return (
    <Panel title={`Clicks: ${data.link.shortUrl}`}>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <StatCard label="Clicks" value={String(data.total)} />
        <StatCard label="Unique people" value={String(data.unique)} />
      </div>
      {data.byDay.length > 0 ? <BarChart data={data.byDay.map((d) => ({ x: d.day.slice(5), y: d.total }))} label="Clicks" format={(n) => String(Math.round(n))} /> : <p className="text-muted-foreground text-sm">No clicks yet.</p>}
      {data.countries.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.countries.map((c) => (
            <Badge key={c.country ?? "unknown"}>
              {c.country ?? "Unknown"} · {c.total}
            </Badge>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ---------------------------------------------------------------- custom fields (service 12) */

const toKey = (label: string) => label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").replace(/^(\d)/, "f_$1").slice(0, 40);

function Fields() {
  const { data, error, reload } = useApi<{ fields: Field[]; max: number }>("/custom-fields");
  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [options, setOptions] = useState("");
  const [edit, setEdit] = useState<{ key: string; label: string; options: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!data) return <Loading />;
  const opts = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
  const act = async (fn: () => Promise<unknown>) => {
    setErr(null);
    try {
      await fn();
      await reload();
    } catch (e) {
      setErr(errorText(e));
    }
  };
  return (
    <Panel title="Custom fields" description={`Save answers like size or skin type and use them in messages as {{key}}. ${data.fields.length} of ${data.max} used.`}>
      <form
        className="mb-4 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void act(async () => {
            await api("/custom-fields", { method: "POST", body: { key: toKey(label), label: label.trim(), type, ...(type === "select" ? { options: opts(options) } : {}) } });
            setLabel("");
            setOptions("");
          });
        }}
      >
        <input required placeholder="Label, e.g. Skin type" aria-label="Field label" value={label} onChange={(e) => setLabel(e.target.value)} className={cn(inputCls, "sm:w-56")} />
        <select aria-label="Field type" value={type} onChange={(e) => setType(e.target.value)} className={cn(inputCls, "w-32")}>
          {["text", "number", "select", "date", "boolean"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {type === "select" && <input required placeholder="Options, comma separated" aria-label="Options" value={options} onChange={(e) => setOptions(e.target.value)} className={cn(inputCls, "sm:w-64")} />}
        <Button type="submit" disabled={data.fields.length >= data.max}>
          <Plus className="size-4" /> Add
        </Button>
      </form>
      {label && <p className="text-muted-foreground -mt-2 mb-3 text-xs">Will be used as {`{{${toKey(label)}}}`}</p>}
      {err && <ErrorNote text={err} />}
      {data.fields.length === 0 ? (
        <p className="text-muted-foreground text-sm">No custom fields yet.</p>
      ) : (
        <ul className="divide-y text-sm">
          {data.fields.map((f) =>
            edit?.key === f.key ? (
              <li key={f.key} className="flex flex-wrap items-center gap-2 py-2">
                <input aria-label="Label" value={edit.label} onChange={(e) => setEdit({ ...edit, label: e.target.value })} className={cn(inputCls, "h-9 sm:w-56")} />
                {f.type === "select" && <input aria-label="Options" value={edit.options} onChange={(e) => setEdit({ ...edit, options: e.target.value })} className={cn(inputCls, "h-9 sm:w-64")} />}
                <Button
                  size="sm"
                  onClick={() =>
                    void act(async () => {
                      await api(`/custom-fields/${f.key}`, { method: "PATCH", body: { label: edit.label.trim(), ...(f.type === "select" ? { options: opts(edit.options) } : {}) } });
                      setEdit(null);
                    })
                  }
                >
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEdit(null)}>
                  Cancel
                </Button>
              </li>
            ) : (
              <li key={f.key} className="flex flex-wrap items-center gap-3 py-2">
                <span className="font-medium">{f.label}</span>
                <code className="text-muted-foreground">{`{{${f.key}}}`}</code>
                <Badge>{f.type}</Badge>
                {f.options.length > 0 && <span className="text-muted-foreground text-xs">{f.options.join(", ")}</span>}
                <span className="flex-1" />
                <Button size="sm" variant="ghost" onClick={() => setEdit({ key: f.key, label: f.label, options: f.options.join(", ") })}>
                  <Pencil className="size-4" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const purge = window.confirm(`Delete “${f.label}”?\n\nOK = also erase the saved values from every customer.\nCancel = keep going without erasing (you'll be asked once more).`);
                    if (!purge && !window.confirm(`Delete the “${f.label}” field but keep customers' saved values?`)) return;
                    void act(() => api(`/custom-fields/${f.key}${purge ? "?purge=true" : ""}`, { method: "DELETE" }));
                  }}
                >
                  <Trash2 className="size-4" /> Delete
                </Button>
              </li>
            ),
          )}
        </ul>
      )}
    </Panel>
  );
}
