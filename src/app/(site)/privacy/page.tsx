import type { Metadata } from "next";

import Privacy from "./privacy.mdx";

import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Sojao AI collects, uses and protects your information.",
  path: "/privacy",
});

const Page = () => {
  return (
    <section className="mx-auto max-w-2xl px-4 py-28 lg:pt-44 lg:pb-32">
      <article className="prose prose-lg dark:prose-invert [overflow-wrap:anywhere]">
        <Privacy />
      </article>
    </section>
  );
};

export default Page;
