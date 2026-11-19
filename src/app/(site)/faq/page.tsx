import React from "react";

import { Background } from "@/components/background";
import { FAQ } from "@/components/blocks/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "Answers about Sojao AI: what the Marketing beta does, which apps it works with, Meta's messaging rules and pricing.",
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
    </Background>
  );
};

export default Page;
