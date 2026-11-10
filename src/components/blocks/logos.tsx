import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Social-proof slot. No customer logos are shown until real beta brands
 * agree to be featured.
 */
export const Logos = () => {
  return (
    <section className="pb-28 lg:pb-32">
      <div className="container text-center">
        <h2 className="mb-4 text-xl text-balance md:text-2xl lg:text-3xl">
          Built for Instagram-first brands.
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl text-balance">
          Now onboarding our first beta brands – fashion, beauty, accessories
          and D2C.
        </p>
        <Button variant="outline" className="mt-6 shadow-md" asChild>
          <Link href="/signup">
            Join the beta <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
