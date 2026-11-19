import { Gem, Shirt, ShoppingBag, Sparkles, Store } from "lucide-react";

const audiences = [
  { name: "Fashion brands", icon: Shirt },
  { name: "Beauty brands", icon: Sparkles },
  { name: "Accessories brands", icon: Gem },
  { name: "D2C eCommerce brands", icon: ShoppingBag },
  { name: "Instagram sellers", icon: Store },
];

/** "Who Sojao is for" (file name kept from the template). */
export function Investors() {
  return (
    <section className="container max-w-5xl py-12">
      <h2 className="text-foreground text-3xl font-medium tracking-wide md:text-4xl">
        Who Sojao is for
      </h2>
      <p className="text-muted-foreground mt-3">
        Coming later: WhatsApp sellers, local shops, clinics, real estate and
        creators.
      </p>
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {audiences.map(({ name, icon: Icon }) => (
          <li key={name} className="bg-background/70 rounded-2xl border p-5">
            <span className="bg-brand/12 flex size-11 items-center justify-center rounded-xl">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-3 font-semibold">{name}</h3>
          </li>
        ))}
      </ul>
    </section>
  );
}
