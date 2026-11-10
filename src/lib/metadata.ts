import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: siteConfig.title,
};

/**
 * Per-page metadata with a canonical URL and matching Open Graph / Twitter
 * tags. (A page-level `openGraph` replaces the root one, so the image and
 * site name are set here every time.)
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
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: path,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  };
}
