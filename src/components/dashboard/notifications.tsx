"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { Bell, DollarSign, Hand, Moon, RefreshCw, UserPlus } from "lucide-react";

import { api } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

export type Notice = {
  id: string;
  kind: "handover" | "sale" | "summary" | "system" | "lead";
  title: string;
  text: string;
  at: string;
  href: string;
  unread: boolean;
};

export const noticeIcon: Record<Notice["kind"], React.ComponentType<{ className?: string }>> = {
  handover: Hand,
  sale: DollarSign,
  summary: Moon,
  lead: UserPlus,
  system: RefreshCw,
};

export const timeAgo = (iso: string) => {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)} d ago`;
  return new Date(iso).toLocaleDateString();
};

/** Notifications from the API, polled every minute. */
export function useNotifications() {
  const [items, setItems] = useState<Notice[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    try {
      const r = await api<{ items: Notice[] }>("/notifications");
      setItems(r.items);
      setError(null);
    } catch {
      setError("Couldn't load notifications.");
    }
  }, []);
  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 60_000);
    return () => clearInterval(t);
  }, [load]);
  const markAllRead = async () => {
    setItems((x) => x?.map((n) => ({ ...n, unread: false })) ?? null);
    await api("/notifications/read", { method: "POST" }).catch(() => {});
  };
  return { items, error, reload: load, markAllRead };
}

export function NoticeRow({ n, onClick }: { n: Notice; onClick?: () => void }) {
  const Icon = noticeIcon[n.kind];
  return (
    <Link href={n.href} onClick={onClick} className="hover:bg-accent/50 flex items-start gap-3 px-4 py-3">
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", n.kind === "handover" ? "bg-amber-500/15" : "bg-brand/12")}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm", n.unread ? "font-semibold" : "font-medium")}>{n.title}</p>
        <p className="text-muted-foreground text-xs">{n.text}</p>
        <p className="text-muted-foreground mt-1 text-[11px]">{timeAgo(n.at)}</p>
      </div>
      {n.unread && <span className="bg-brand mt-1.5 size-2 shrink-0 rounded-full" />}
    </Link>
  );
}

/** Bell button with a dropdown of recent notifications. */
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { items, markAllRead } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);
  const unread = items?.filter((n) => n.unread).length ?? 0;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-muted-foreground hover:text-foreground relative -m-2 flex p-2"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="bg-brand absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="bg-popover text-popover-foreground absolute right-0 z-50 mt-3 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="font-semibold">Notifications</p>
            <button className="text-muted-foreground hover:text-foreground text-xs" onClick={() => void markAllRead()}>
              Mark all read
            </button>
          </div>
          <div className="max-h-96 divide-y overflow-y-auto">
            {items === null ? (
              <p className="text-muted-foreground p-6 text-center text-sm">Loading…</p>
            ) : items.length === 0 ? (
              <p className="text-muted-foreground p-6 text-center text-sm">Nothing yet. New leads, sales and chats that need you show up here.</p>
            ) : (
              items.slice(0, 5).map((n) => <NoticeRow key={n.id} n={n} onClick={() => setOpen(false)} />)
            )}
          </div>
          <Link href="/dashboard/notifications" onClick={() => setOpen(false)} className="hover:bg-accent/50 block border-t px-4 py-3 text-center text-sm font-medium">
            See all
          </Link>
        </div>
      )}
    </div>
  );
}
