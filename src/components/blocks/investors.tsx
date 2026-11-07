import Image from "next/image";

const investors = [
  {
    name: "Fashion Brands",
    company: "Available now",
    image: "/investors/1.webp",
  },
  {
    name: "Beauty Brands",
    company: "Available now",
    image: "/investors/2.webp",
  },
  {
    name: "Accessories Brands",
    company: "Available now",
    image: "/investors/3.webp",
  },
  {
    name: "D2C eCommerce Brands",
    company: "Available now",
    image: "/investors/4.webp",
  },
  {
    name: "Instagram Sellers",
    company: "Available now",
    image: "/investors/5.webp",
  },
];

export function Investors() {
  return (
    <section className="container max-w-5xl py-12">
      <h2 className="text-foreground text-4xl font-medium tracking-wide">
        Who Sojao is for
      </h2>
      <p className="text-muted-foreground mt-3">
        Coming soon: WhatsApp sellers, local shops, clinics, real estate and
        creators.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {investors.map((investor) => (
          <div key={investor.name} className="">
            <Image
              src={investor.image}
              alt={investor.name}
              width={120}
              height={120}
              className="object-cover"
            />
            <h3 className="mt-3 font-semibold">{investor.name}</h3>
            <p className="text-muted-foreground">{investor.company}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
