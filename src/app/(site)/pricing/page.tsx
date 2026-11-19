import React from "react";

import { PricingTable } from "@/components/_later/pricing-table";
import { Background } from "@/components/background";
import { Pricing } from "@/components/blocks/pricing";
import { pageMetadata } from "@/lib/seo";
import { SHOW_PRICING } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Sojao AI is free during the beta. Pricing is coming soon. Marketing automations for Instagram and Messenger are included.",
  path: "/pricing",
});

const Page = () => {
  return (
    <Background>
      <Pricing className="py-28 text-center lg:pt-44 lg:pb-32" />
      {SHOW_PRICING && <PricingTable />}
    </Background>
  );
};

export default Page;
