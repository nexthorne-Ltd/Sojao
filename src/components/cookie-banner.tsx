"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const KEY = "sojao-cookie-consent";
export type CookieConsent = "essential" | "all";

/** Read the visitor's choice. Anything other than "all" means essential only. */
export function getCookieConsent(): CookieConsent {
  try {
    return window.localStorage.getItem(KEY) === "all" ? "all" : "essential";
  } catch {
    return "essential";
  }
}

/**
 * Minimal, privacy-first cookie notice. Non-essential cookies are OFF by
 * default and stay off unless the visitor clicks "Allow all". Today the
 * site sets no analytics or advertising cookies at all; any added later
 * must check `getCookieConsent() === "all"` first.
 */
export function CookieBanner() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(!window.localStorage.getItem(KEY));
    } catch {
      setShow(false);
    }
  }, []);

  // Public website only; signed-in app pages don't need the notice again.
  if (!show || pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  const choose = (v: CookieConsent) => {
    try {
      window.localStorage.setItem(KEY, v);
    } catch {}
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="bg-background/95 fixed inset-x-3 bottom-3 z-[110] mx-auto max-w-xl rounded-2xl border p-4 shadow-xl backdrop-blur md:bottom-6"
    >
      <p className="text-sm">
        We only use essential cookies and local storage to make this site work
        (for example, your theme choice). We don&apos;t use advertising or
        analytics cookies unless you allow them.{" "}
        <Link href="/privacy#cookies" className="underline underline-offset-4">
          Learn more
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button
          onClick={() => choose("essential")}
          className="bg-primary text-primary-foreground min-h-10 rounded-full px-4 text-sm font-medium"
        >
          Essential only
        </button>
        <button
          onClick={() => choose("all")}
          className="hover:bg-accent min-h-10 rounded-full border px-4 text-sm font-medium"
        >
          Allow all
        </button>
      </div>
    </div>
  );
}
