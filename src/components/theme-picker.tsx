"use client";

import { useEffect, useRef, useState } from "react";

import { Check, Palette } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export const THEMES = [
  { id: "light", label: "Light", swatch: "#f3ead6", ring: "#d4d4d4" },
  { id: "dark", label: "Dark", swatch: "#1f1f1f", ring: "#525252" },
  { id: "crimson", label: "Crimson", swatch: "#e0162b", ring: "#e0162b" },
  { id: "toxic", label: "Toxic", swatch: "#39ff14", ring: "#39ff14" },
  { id: "inferno", label: "Inferno", swatch: "#ff7a00", ring: "#ff7a00" },
  { id: "neon", label: "Neon", swatch: "#ff1f8f", ring: "#ff1f8f" },
  { id: "electric", label: "Electric", swatch: "#1ec8ff", ring: "#1ec8ff" },
  {
    id: "cobalt",
    label: "Cobalt Combo",
    swatch: "linear-gradient(135deg, #023661 50%, #db5227 50%)",
    ring: "#0a0c12",
  },
] as const;

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed right-4 bottom-4 z-[100] md:right-6 md:bottom-6">
      {open && (
        <div
          role="menu"
          className="bg-popover text-popover-foreground animate-in fade-in slide-in-from-bottom-2 absolute right-0 bottom-16 w-48 rounded-xl border p-2 shadow-xl"
        >
          <p className="text-muted-foreground px-2 pt-1 pb-2 text-xs font-medium tracking-wide uppercase">
            Color theme
          </p>
          {THEMES.map((t) => {
            const active = mounted && theme === t.id;
            return (
              <button
                key={t.id}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                  active && "bg-accent text-accent-foreground",
                )}
              >
                <span
                  className="size-5 shrink-0 rounded-full border-2"
                  style={{ background: t.swatch, borderColor: t.ring }}
                />
                <span className="flex-1 text-left">{t.label}</span>
                {active && <Check className="size-4" />}
              </button>
            );
          })}
        </div>
      )}
      <button
        type="button"
        aria-label="Change color theme"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="bg-primary text-primary-foreground ring-background flex size-12 items-center justify-center rounded-full shadow-lg ring-4 transition-transform hover:scale-110 active:scale-95"
      >
        <Palette className="size-5" />
      </button>
    </div>
  );
}
