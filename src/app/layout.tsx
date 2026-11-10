import localFont from "next/font/local";

import type { Metadata } from "next";

import { StyleGlideProvider } from "@/components/styleglide-provider";
import { ThemePicker } from "@/components/theme-picker";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site-config";
import "@/styles/globals.css";

const dmSans = localFont({
  src: [
    {
      path: "../../fonts/dm-sans/DMSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../fonts/dm-sans/DMSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../fonts/dm-sans/DMSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../fonts/dm-sans/DMSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

// Inter + Fredoka are self-hosted (variable woff2, latin) instead of
// next/font/google so builds never depend on fetching Google Fonts.
const inter = localFont({
  src: "../../fonts/inter/Inter-Variable-latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
});

const fredoka = localFont({
  src: "../../fonts/fredoka/Fredoka-Variable-latin.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | Sojao AI",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Instagram DM automation",
    "AI sales agent",
    "WhatsApp AI",
    "Facebook Messenger AI",
    "comment to DM",
    "Shopify AI chat",
    "small business customer support",
  ],
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  // Favicon and Open Graph image come from src/app/icon.svg,
  // src/app/apple-icon.tsx and src/app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body className={`${dmSans.variable} ${inter.variable} ${fredoka.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          themes={[
            "light",
            "dark",
            "crimson",
            "toxic",
            "inferno",
            "neon",
            "electric",
            "cobalt",
          ]}
          disableTransitionOnChange
        >
          <StyleGlideProvider />
          {children}
          <ThemePicker />
        </ThemeProvider>
      </body>
    </html>
  );
}
