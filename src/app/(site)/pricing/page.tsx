import React from "react";

import type { Metadata } from "next";

import { Background } from "@/components/background";
import { Pricing } from "@/components/blocks/pricing";
import { PricingTable } from "@/components/blocks/pricing-table";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Simple plans for Sojao AI. Beta brands get the first 3 months free.",
  path: "/pricing",
});

const Page = () => {
  return (
    <Background>
      <Pricing className="py-28 text-center lg:pt-44 lg:pb-32" />
      <PricingTable />
    </Background>
  );
};

export default Page;
