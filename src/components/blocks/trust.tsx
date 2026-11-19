import Link from "next/link";

import { ArrowRight, KeyRound, Lock } from "lucide-react";
import { FaFacebookMessenger, FaInstagram } from "react-icons/fa";
import { SiMeta } from "react-icons/si";

import { cn } from "@/lib/utils";

/** Official brand colours. */
const META_BLUE = "#0081FB";
const INSTAGRAM_GRADIENT =
  "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)";
const MESSENGER_GRADIENT = "linear-gradient(45deg, #0099FF 0%, #A033FF 60%, #FF5280 90%, #FF7061 100%)";

type Logo = "meta" | "instagram" | "lock" | "key";

/** Every point here matches what the Privacy Policy already says. */
export const trustPoints: { title: string; text: string; logo: Logo }[] = [
  {
    title: "Meta's official connection",
    text: "Sojao connects to Instagram and Messenger through Meta's official login. We never ask for your password.",
    logo: "meta",
  },
  {
    title: "Tokens stored encrypted",
    text: "Channel access tokens are stored encrypted, and all traffic uses HTTPS.",
    logo: "key",
  },
  {
    title: "Inside Instagram's rules",
    text: "One private reply per comment, promos only inside the 24-hour window, and “stop” always works.",
    logo: "instagram",
  },
  {
    title: "You stay in control",
    text: "Disconnect a channel any time in Settings, and ask us to delete your data whenever you like.",
    logo: "lock",
  },
];

/** Icon tile for a trust point: real Meta / Instagram logos, plain icons otherwise. */
export const TrustIcon = ({ logo, className }: { logo: Logo; className?: string }) => {
  const base = "flex size-10 shrink-0 items-center justify-center rounded-xl";
  if (logo === "meta")
    return (
      <span className={cn(base, "border bg-white", className)}>
        <SiMeta className="size-6" style={{ color: META_BLUE }} aria-label="Meta" />
      </span>
    );
  if (logo === "instagram")
    return (
      <span className={cn(base, "text-white", className)} style={{ background: INSTAGRAM_GRADIENT }}>
        <FaInstagram className="size-5" aria-label="Instagram" />
      </span>
    );
  const Icon = logo === "key" ? KeyRound : Lock;
  return (
    <span className={cn(base, "bg-brand/12 text-brand", className)}>
      <Icon className="size-5" />
    </span>
  );
};

/** "Built on" row with the three platforms Sojao connects to. */
export const PlatformRow = ({ className }: { className?: string }) => (
  <ul className={cn("flex flex-wrap items-center gap-3", className)}>
    <li className="bg-background/70 flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-sm font-medium">
      <span className="flex size-7 items-center justify-center rounded-full bg-white">
        <SiMeta className="size-4.5" style={{ color: META_BLUE }} />
      </span>
      Meta
    </li>
    <li className="bg-background/70 flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-sm font-medium">
      <span
        className="flex size-7 items-center justify-center rounded-full text-white"
        style={{ background: INSTAGRAM_GRADIENT }}
      >
        <FaInstagram className="size-4" />
      </span>
      Instagram
    </li>
    <li className="bg-background/70 flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-sm font-medium">
      <span
        className="flex size-7 items-center justify-center rounded-full text-white"
        style={{ background: MESSENGER_GRADIENT }}
      >
        <FaFacebookMessenger className="size-4" />
      </span>
      Messenger
    </li>
  </ul>
);

export const Trust = () => {
  return (
    <section id="trust" className="pb-28 lg:pb-32">
      <div className="container max-w-5xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="max-w-lg text-3xl tracking-tight text-balance md:text-4xl lg:text-5xl">
              Safe for your account. Safe for your customers.
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-muted-foreground text-sm">Connects through</span>
              <PlatformRow />
            </div>
          </div>
          <Link
            href="/security"
            className="text-brand inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
          >
            How we keep data safe <ArrowRight className="size-4" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {trustPoints.map(({ title, text, logo }) => (
            <li key={title} className="bg-background/70 rounded-3xl border p-6 backdrop-blur">
              <TrustIcon logo={logo} />
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
