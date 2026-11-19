import localFont from "next/font/local";

import type { Metadata } from "next";

import { CookieBanner } from "@/components/cookie-banner";
import { StyleGlideProvider } from "@/components/styleglide-provider";
import { ThemePicker } from "@/components/theme-picker";
import { ThemeProvider } from "@/components/theme-provider";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, siteUrl } from "@/lib/site-config";
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

const DESCRIPTION =
  "Sojao AI is an AI marketing agent for Instagram-first brands. Comment-to-DM, story replies, lead capture and broadcasts on Instagram and Messenger. Marketing is live in beta; Sales and Support are coming soon.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.brandName}: ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  applicationName: siteConfig.brandName,
  keywords: [
    "Instagram DM automation",
    "comment to DM",
    "Instagram story reply automation",
    "Facebook Messenger automation",
    "lead capture",
    "AI marketing agent",
    "small business marketing",
  ],
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
  ...pageMetadata({ description: DESCRIPTION, path: "/" }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme editor preview hook: development only, never loaded for visitors */}
        {process.env.NODE_ENV === "development" && (
          <script
            async
            crossOrigin="anonymous"
            src="https://tweakcn.com/live-preview.min.js"
          />
        )}
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
            "sojao",
          ]}
          disableTransitionOnChange
        >
          <StyleGlideProvider />
          {children}
          <ThemePicker />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
