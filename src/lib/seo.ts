import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

const OG_IMAGE = {
  url: "/og",
  width: 1200,
  height: 630,
  alt: `${siteConfig.brandName}: ${siteConfig.tagline}`,
};

/**
 * Metadata for a public page: title, description, canonical URL and the
 * same Open Graph / Twitter image on every page.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = title
    ? `${title} | ${siteConfig.brandName}`
    : `${siteConfig.brandName}: ${siteConfig.tagline}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.brandName,
      title: fullTitle,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
