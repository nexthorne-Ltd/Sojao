import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { DashedLine } from "../dashed-line";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Honest placeholder until real beta brands share their results.
 * Replace with real, approved testimonials only.
 */
export const Testimonials = ({
  className,
  dashedLineClassName,
}: {
  className?: string;
  dashedLineClassName?: string;
}) => {
  return (
    <>
      <section className={cn("py-28 lg:py-32", className)}>
        <div className="container">
          <div className="bg-card/60 mx-auto max-w-2xl rounded-3xl border px-6 py-12 text-center shadow-sm md:px-12">
            <h2 className="text-2xl tracking-tight md:text-4xl">
              What brand owners say
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-md leading-snug">
              Results from our beta brands are coming soon.
            </p>
            <Button variant="outline" className="mt-6 shadow-md" asChild>
              <Link href="/signup">
                Join the beta <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <DashedLine
        orientation="horizontal"
        className={cn("mx-auto max-w-[80%]", dashedLineClassName)}
      />
    </>
  );
};
