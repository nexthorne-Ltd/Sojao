"use client";

import { useState } from "react";

import { FaFacebookMessenger, FaInstagram, FaWhatsapp } from "react-icons/fa";

import type { Channel } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

/* ---------- Page header ---------- */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        {/* The visible page title lives in the top bar */}
        <h1 className="sr-only">{title}</h1>
        {description && (
          <p className="text-muted-foreground max-w-2xl text-base">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/* ---------- Panel (card) ---------- */
export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "bg-card text-card-foreground rounded-2xl border shadow-xs",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            {title && <h2 className="font-semibold">{title}</h2>}
            {description && (
              <p className="text-muted-foreground mt-0.5 text-sm">
                {description}
              </p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/* ---------- Stat card ---------- */
export function StatCard({
  label,
  value,
  change,
  hint,
}: {
  label: string;
  value: string;
  change?: string;
  hint?: string;
}) {
  return (
    <div className="bg-card rounded-2xl border p-5 shadow-xs">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="font-display mt-2 text-3xl tracking-tight tabular-nums">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {change && (
          <span className="bg-brand/12 text-foreground rounded-full px-2 py-0.5 font-medium">
            {change}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

/* ---------- Badge ---------- */
const badgeTones = {
  neutral: "bg-muted text-muted-foreground",
  brand: "bg-brand/15 text-foreground",
  good: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  warn: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  bad: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  info: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof badgeTones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Channel icon ---------- */
const channelMeta: Record<
  Channel,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  instagram: { label: "Instagram", icon: FaInstagram, color: "#E1306C" },
  messenger: { label: "Messenger", icon: FaFacebookMessenger, color: "#0084FF" },
  whatsapp: { label: "WhatsApp", icon: FaWhatsapp, color: "#25D366" },
};

export const channelLabel = (c: Channel) => channelMeta[c].label;

export function ChannelIcon({
  channel,
  className,
  withLabel,
}: {
  channel: Channel;
  className?: string;
  withLabel?: boolean;
}) {
  const { icon: Icon, color, label } = channelMeta[channel];
  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <span style={{ color }} className="inline-flex">
        <Icon className={cn("size-4", className)} />
      </span>
      {withLabel && <span className="text-sm">{label}</span>}
      {!withLabel && <span className="sr-only">{label}</span>}
    </span>
  );
}

/* ---------- Avatar ---------- */
export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        "bg-brand/15 text-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        className,
      )}
    >
      {initials}
    </span>
  );
}

/* ---------- Tabs ---------- */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "bg-muted inline-flex max-w-full gap-1 overflow-x-auto rounded-xl p-1",
        className,
      )}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
            value === t.id
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="text-muted-foreground text-xs tabular-nums">
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ---------- Toggle (small switch) ---------- */
export function Toggle({
  defaultOn = false,
  label,
  onChange,
}: {
  defaultOn?: boolean;
  label: string;
  onChange?: (on: boolean) => void;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => {
        setOn(!on);
        onChange?.(!on);
      }}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
        on ? "bg-primary" : "bg-input",
      )}
    >
      <span
        className={cn(
          "bg-background inline-block size-4 rounded-full shadow transition-transform",
          on ? "translate-x-4.5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

/* ---------- Table helpers ---------- */
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-5 -my-5 overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "text-muted-foreground border-b px-5 py-3 text-left text-xs font-medium tracking-wide uppercase",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("border-b px-5 py-3 align-middle", className)}>
      {children}
    </td>
  );
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
