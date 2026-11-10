/**
 * Public company details used across the marketing site (footer, contact,
 * legal pages, metadata). Values come from env variables so nothing is
 * invented: if a value is not set, the UI hides that item instead of showing
 * a placeholder. See .env.example.
 */

const trimSlash = (url: string) => url.replace(/\/+$/, "");

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return trimSlash(process.env.NEXT_PUBLIC_SITE_URL);
  }
  // Set automatically by Vercel for production deployments.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

const optional = (value: string | undefined) => value?.trim() || undefined;

export const siteConfig = {
  name: "Sojao AI",
  /** Company that owns and operates Sojao AI. */
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME?.trim() || "Nexthorne",
  url: resolveSiteUrl(),
  title: "Sojao AI – Your business sleeps. Your customers don't.",
  description:
    "Sojao is an AI agent, now in beta, that answers your customers on Instagram, Messenger and WhatsApp, day and night.",
  contactEmail: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  address: optional(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS),
  social: {
    x: optional(process.env.NEXT_PUBLIC_X_URL),
    linkedin: optional(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  },
};
