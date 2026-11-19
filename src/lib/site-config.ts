/**
 * Central site config for Sojao AI.
 *
 * Every value in square brackets is a PLACEHOLDER that must be filled in
 * before launch / Meta Business Verification. Pages never show a
 * placeholder to visitors: use `has()` / `value()` below, which treat a
 * bracketed value as "not set" and hide that line instead.
 */

export const siteConfig = {
  /** Must match the official registration documents exactly. Please confirm spelling. */
  legalName: "Nexthorne",
  brandName: "Sojao AI",
  founderName: "Badar Abbas",
  tagline: "Your business sleeps. Your customers don't.",

  address: "[BUSINESS ADDRESS]",
  phone: "[BUSINESS PHONE]",
  /** Must be on our own domain (Meta checks this). */
  supportEmail: "[SUPPORT EMAIL]",
  privacyEmail: "[PRIVACY EMAIL]",
  /** e.g. "sojao.ai" (no https://). Used for canonical URLs and the sitemap. */
  domain: "[OUR DOMAIN]",
  country: "[COUNTRY]",
  /** Date shown on Privacy, Terms and Data deletion, e.g. "10 November 2026". */
  lastUpdated: "[DATE]",

  /** Privacy policy: how long data is kept, e.g. "90 days after account closure". */
  retentionPeriod: "[RETENTION PERIOD]",
  /** Data deletion page: how long a deletion request takes, e.g. "30 days". */
  deletionTime: "[DELETION TIME]",
  /** Terms of Service: governing law, e.g. "the laws of England and Wales". */
  governingLaw: "[GOVERNING LAW]",

  copyrightYear: 2026,

  /** Fallback public URL until `domain` is set. */
  deployedUrl: "https://sojao-dwcj.vercel.app",

  /** Social links. Leave empty to hide. Only add real profile URLs. */
  social: {
    instagram: "",
    linkedin: "",
    x: "",
  },
} as const;

/**
 * Pricing switch. While false, every page shows
 * "Free during beta, pricing coming soon" instead of plan prices.
 */
export const SHOW_PRICING = false;

type ConfigKey = {
  [K in keyof typeof siteConfig]: (typeof siteConfig)[K] extends string ? K : never;
}[keyof typeof siteConfig];

/** True when a value is a real value (not empty, not a [PLACEHOLDER]). */
export const isSet = (v: string | undefined | null): v is string =>
  !!v && v.trim().length > 0 && !/^\[.*\]$/.test(v.trim());

/** True when the config key holds a real value. */
export const has = (key: ConfigKey) => isSet(siteConfig[key]);

/** The config value, or `undefined` while it is still a placeholder. */
export const value = (key: ConfigKey): string | undefined =>
  isSet(siteConfig[key]) ? siteConfig[key] : undefined;

/** Canonical site URL (no trailing slash). */
export const siteUrl = isSet(siteConfig.domain)
  ? `https://${siteConfig.domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  : siteConfig.deployedUrl;

/** List of config keys that are still placeholders (handy for a pre-launch check). */
export const missingConfig = (Object.keys(siteConfig) as (keyof typeof siteConfig)[]).filter(
  (k) => typeof siteConfig[k] === "string" && !isSet(siteConfig[k] as string),
);
