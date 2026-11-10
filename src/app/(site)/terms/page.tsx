import type { Metadata } from "next";

import Terms from "./terms.mdx";

import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms that apply when you use Sojao AI.",
  path: "/terms",
});

const Page = () => {
  return (
    <section className="mx-auto max-w-2xl px-4 py-28 lg:pt-44 lg:pb-32">
      <article className="prose prose-lg dark:prose-invert [overflow-wrap:anywhere]">
        <Terms />
      </article>
    </section>
  );
};

export default Page;
