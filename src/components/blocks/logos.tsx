/* eslint-disable @next/next/no-img-element */
import { Gem, Shirt, ShoppingBag, Sparkles, Store } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * "Who it's for" strip. We don't show customer logos until we have real,
 * approved beta brands to show. Photos are free-to-use Unsplash images.
 */
const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=750&q=75`;

const CATEGORIES = [
  {
    name: "Fashion",
    icon: Shirt,
    image: unsplash("photo-1441984904996-e0b6ba687e04"),
    alt: "Clothing boutique with hanging racks",
  },
  {
    name: "Beauty",
    icon: Sparkles,
    image: unsplash("photo-1608571423902-eed4a5ad8108"),
    alt: "Amber skincare dropper bottle on a wooden stand",
  },
  {
    name: "Accessories",
    icon: Gem,
    image: unsplash("photo-1617038220319-276d3cfab638"),
    alt: "Gold hoop earrings resting on white stones",
  },
  {
    name: "D2C brands",
    icon: ShoppingBag,
    image: unsplash("photo-1617825295690-28ae56c56135"),
    alt: "Green and pink shipping boxes",
  },
  {
    name: "Instagram sellers",
    icon: Store,
    image: unsplash("photo-1753164597612-5e71b83fda91"),
    alt: "Small business owner on the phone while working on a laptop",
  },
];

export const Logos = () => {
  return (
    <section className="overflow-hidden pb-28 lg:pb-32">
      <div className="container space-y-8 text-center lg:space-y-10">
        <h2 className="text-xl text-balance md:text-2xl lg:text-3xl">
          Built for Instagram-first brands.
          <br className="max-md:hidden" />{" "}
          <span className="text-muted-foreground">
            Small teams that answer their own DMs.
          </span>
        </h2>
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {CATEGORIES.map(({ name, icon: Icon, image, alt }, i) => (
            <li
              key={name}
              className={cn(
                "group bg-muted relative aspect-[4/5] overflow-hidden rounded-3xl border shadow-sm",
                i === CATEGORIES.length - 1 && "max-md:col-span-2 max-md:aspect-[8/5]",
              )}
            >
              <img
                src={image}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />
              <span className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-2xl border border-white/20 bg-black/30 px-3 py-1.5 text-left text-sm leading-tight font-medium text-white backdrop-blur-md md:max-lg:text-xs">
                <Icon className="size-4 shrink-0" />
                <span>{name}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
