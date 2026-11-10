import React from "react";

import type { Metadata } from "next";

import { Background } from "@/components/background";
import { FAQ } from "@/components/blocks/faq";
import { Testimonials } from "@/components/blocks/testimonials";
import { DashedLine } from "@/components/dashed-line";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Answers to common questions about Sojao AI and the beta.",
  path: "/faq",
});

const Page = () => {
  return (
    <Background>
      <FAQ
        className="py-28 text-center lg:pt-44 lg:pb-32"
        className2="max-w-xl lg:grid-cols-1"
        headerTag="h1"
      />
      <DashedLine className="mx-auto max-w-xl" />
      <Testimonials dashedLineClassName="hidden" />
    </Background>
  );
};

export default Page;
