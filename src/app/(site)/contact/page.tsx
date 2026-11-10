import React from "react";

import type { Metadata } from "next";

import { Background } from "@/components/background";
import Contact from "@/components/blocks/contact";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Questions about Sojao AI or the beta? Talk to us.",
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
