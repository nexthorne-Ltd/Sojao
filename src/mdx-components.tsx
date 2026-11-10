import type { MDXComponents } from "mdx/types";

// Required by @next/mdx so MDX pages (privacy, terms) render as server components.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return components;
}
