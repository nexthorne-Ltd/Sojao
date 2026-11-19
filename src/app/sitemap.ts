import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-config";

const PUBLIC_ROUTES = [
  "",
  "/features",
  "/instagram",
  "/messenger",
  "/ai-agent",
  "/integrations",
  "/use-cases",
  "/templates",
  "/guides",
  "/roadmap",
  "/security",
  "/about",
  "/pricing",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/data-deletion",
  "/login",
  "/signup",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
