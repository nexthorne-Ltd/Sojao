"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
  Bell,
  DollarSign,
  Hand,
  Moon,
  RefreshCw,
  UserPlus,
} from "lucide-react";

import { type Notice, notifications } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export const noticeIcon: Record<Notice["kind"], React.ComponentType<{ className?: string }>> = {
  handover: Hand,
  sale: DollarSign,
  summary: Moon,
  lead: UserPlus,
  system: RefreshCw,
};

export function NoticeRow({ n, onClick }: { n: Notice; onClick?: () => void }) {
  const Icon = noticeIcon[n.kind];
  return (
    <Link
      href={n.href}
      onClick={onClick}
      className="hover:bg-accent/50 flex items-start gap-3 px-4 py-3"
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          n.kind === "handover" ? "bg-amber-500/15" : "bg-brand/12",
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm", n.unread ? "font-semibold" : "font-medium")}>
          {n.title}
        </p>
        <p className="text-muted-foreground text-xs">{n.text}</p>
        <p className="text-muted-foreground mt-1 text-[11px]">{n.time}</p>
      </div>
      {n.unread && <span className="bg-brand mt-1.5 size-2 shrink-0 rounded-full" />}
    </Link>
  );
}

/** Bell button with a dropdown of recent notifications. */
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const ref = useRef<HTMLDivElement>(null);
  const unread = items.filter((n) => n.unread).length;

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
        className="text-muted-foreground hover:text-foreground relative flex"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="bg-brand absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="bg-popover text-popover-foreground absolute right-0 z-50 mt-3 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="font-semibold">Notifications</p>
            <button
              className="text-muted-foreground hover:text-foreground text-xs"
              onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))}
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-96 divide-y overflow-y-auto">
            {items.slice(0, 5).map((n) => (
              <NoticeRow key={n.id} n={n} onClick={() => setOpen(false)} />
            ))}
          </div>
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="hover:bg-accent/50 block border-t px-4 py-3 text-center text-sm font-medium"
          >
            See all
          </Link>
        </div>
      )}
    </div>
  );
}
