"use client";

import { useState } from "react";

import Link from "next/link";

import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, request } from "@/lib/marketing-api";

const message = (e: unknown) =>
  e instanceof ApiError
    ? e.status === 0
      ? e.message
      : (e.body.issues?.[0]?.message ?? e.body.error ?? "Something went wrong. Try again.")
    : "Something went wrong. Try again.";

/** Only same-site paths are allowed after login (no open redirects). */
const safeNext = (raw: string | null) => (raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard");

function ErrorLine({ text }: { text: string }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 p-2.5 text-sm text-rose-700 dark:text-rose-300">
      <AlertCircle className="mt-0.5 size-4 shrink-0" /> {text}
    </p>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr(null);
        try {
          await request("/auth/login", { method: "POST", body: { email, password } });
          window.location.href = safeNext(new URLSearchParams(window.location.search).get("next"));
        } catch (x) {
          setErr(message(x));
          setBusy(false);
        }
      }}
    >
      <Input type="email" autoComplete="email" placeholder="Enter your email" aria-label="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" autoComplete="current-password" placeholder="Enter your password" aria-label="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="flex justify-end">
        {/* No self-serve reset yet: send people to Contact. */}
        <Link href="/contact" className="text-primary text-sm font-medium">
          Forgot password?
        </Link>
      </div>
      {err && <ErrorLine text={err} />}
      <Button type="submit" className="mt-2 w-full" disabled={busy}>
        {busy && <Loader2 className="size-4 animate-spin" />} Log in
      </Button>
    </form>
  );
}

export function SignupForm() {
  const [name, setName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (password.length < 8) return setErr("Use at least 8 characters for your password.");
        setBusy(true);
        setErr(null);
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          await request("/auth/signup", { method: "POST", body: { name, brandName, email, password, timezone } });
          window.location.href = "/onboarding";
        } catch (x) {
          setErr(message(x));
          setBusy(false);
        }
      }}
    >
      <Input type="text" autoComplete="name" placeholder="Your name" aria-label="Your name" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="text" autoComplete="organization" placeholder="Brand name" aria-label="Brand name" required maxLength={80} value={brandName} onChange={(e) => setBrandName(e.target.value)} />
      <Input type="email" autoComplete="email" placeholder="Enter your email" aria-label="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <div>
        <Input type="password" autoComplete="new-password" placeholder="Create a password" aria-label="Password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className="text-muted-foreground mt-1 text-sm">Must be at least 8 characters.</p>
      </div>
      {err && <ErrorLine text={err} />}
      <Button type="submit" className="mt-2 w-full" disabled={busy}>
        {busy && <Loader2 className="size-4 animate-spin" />} Start free
      </Button>
    </form>
  );
}
