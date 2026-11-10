import { Camera, Gem, Shirt, ShoppingCart, Sparkles } from "lucide-react";

const audiences = [
  { name: "Fashion brands", icon: Shirt },
  { name: "Beauty brands", icon: Sparkles },
  { name: "Accessories brands", icon: Gem },
  { name: "D2C eCommerce brands", icon: ShoppingCart },
  { name: "Instagram sellers", icon: Camera },
];

export function Investors() {
  return (
    <section className="container max-w-5xl py-12">
      <h2 className="text-foreground text-3xl font-medium tracking-wide md:text-4xl">
        Who Sojao is for
      </h2>
      <p className="text-muted-foreground mt-3">
        Built first for these sellers. Later: WhatsApp sellers, local shops,
        clinics, real estate and creators.
      </p>
      <ul className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {audiences.map(({ name, icon: Icon }) => (
          <li key={name} className="bg-card/60 rounded-2xl border p-5">
            <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 font-semibold">{name}</h3>
          </li>
        ))}
      </ul>
    </section>
  );
}
