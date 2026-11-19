import React from "react";

import { Background } from "@/components/background";
import Contact from "@/components/blocks/contact";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.legalName}, the company behind ${siteConfig.brandName}. Questions about the beta, privacy or your data.`,
  path: "/contact",
});

const Page = () => {
  return (
    <Background>
      <Contact />
    </Background>
  );
};

export default Page;
