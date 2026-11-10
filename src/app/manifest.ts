import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sojao AI",
    short_name: "Sojao AI",
    description:
      "An AI agent that answers your customers on Instagram, Messenger and WhatsApp.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1426",
    theme_color: "#0b1426",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
