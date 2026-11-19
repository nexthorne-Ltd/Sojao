import { cn } from "@/lib/utils";

/** Shared top-of-page heading for simple marketing pages. */
export const PageHeader = ({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) => (
  <header className={cn("container max-w-3xl pb-16 text-center lg:pb-20", className)}>
    {eyebrow && (
      <p className="text-brand font-mono text-sm font-medium tracking-wide uppercase">
        {eyebrow}
      </p>
    )}
    <h1 className="mt-3 text-4xl tracking-tight text-balance md:text-5xl lg:text-6xl">
      {title}
    </h1>
    {description && (
      <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-lg text-balance">
        {description}
      </p>
    )}
  </header>
);
