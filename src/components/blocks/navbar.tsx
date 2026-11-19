"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArrowRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NAV, type NavLink } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

const Badge = ({ text }: { text: string }) => (
  <span className="bg-muted text-muted-foreground rounded-full border px-1.5 py-px text-[10px] font-semibold tracking-wide uppercase">
    {text}
  </span>
);

function MenuLink({ link, onClick }: { link: NavLink; onClick?: () => void }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      onClick={onClick}
      className="group/link hover:bg-accent focus-visible:bg-accent flex items-start gap-3 rounded-xl p-2.5 outline-hidden transition-colors"
    >
      {Icon && (
        <span className="bg-brand/10 text-brand group-hover/link:bg-brand flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors group-hover/link:text-white">
          <Icon className="size-4" />
        </span>
      )}
      <span className="min-w-0 transition-transform duration-300 group-hover/link:translate-x-0.5">
        <span className="flex items-center gap-2 text-sm leading-tight font-medium">
          {link.title}
          {link.badge && <Badge text={link.badge} />}
        </span>
        {link.description && (
          <span className="text-muted-foreground mt-0.5 block text-xs leading-snug">{link.description}</span>
        )}
      </span>
    </Link>
  );
}

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed left-1/2 z-50 -translate-x-1/2 rounded-4xl border backdrop-blur-xl transition-[top,width,background-color,box-shadow] duration-500",
        scrolled
          ? "bg-background/85 top-12 w-[min(94%,960px)] shadow-lg shadow-black/5"
          : "bg-background/60 top-14 w-[min(92%,1040px)] lg:top-[72px]",
      )}
    >
      <div className="flex items-center justify-between gap-4 py-2.5 pr-2.5 pl-5">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Sojao AI home">
          <Logo className="text-[24px]" />
        </Link>

        {/* Desktop navigation */}
        <NavigationMenu className="max-lg:hidden">
          <NavigationMenuList className="space-x-0.5">
            {NAV.map((item) =>
              "groups" in item ? (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger className="data-[state=open]:bg-accent/60 h-9 rounded-full bg-transparent! px-3">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className={cn("flex gap-2 p-3", item.feature ? "w-[720px]" : "w-[600px]")}>
                      {item.groups.map((g) => (
                        <div key={g.label} className="flex-1">
                          <p className="text-muted-foreground px-2.5 pt-1 pb-2 text-[11px] font-semibold tracking-wider uppercase">
                            {g.label}
                          </p>
                          <ul className="space-y-0.5">
                            {g.links.map((l) => (
                              <li key={l.title}>
                                <NavigationMenuLink asChild>
                                  <MenuLink link={l} />
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {item.feature && (
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.feature.href}
                            className="group/feat bg-primary text-primary-foreground relative flex w-52 shrink-0 flex-col justify-end overflow-hidden rounded-2xl p-4"
                          >
                            <span className="bg-brand/50 pointer-events-none absolute -top-10 -right-10 size-36 rounded-full blur-2xl transition-transform duration-700 group-hover/feat:scale-125" />
                            <span className="relative mb-auto flex size-2.5">
                              <span className="bg-brand absolute inline-flex size-full animate-ping rounded-full opacity-70" />
                              <span className="bg-brand relative inline-flex size-2.5 rounded-full" />
                            </span>
                            <span className="relative mt-10 text-base leading-tight font-semibold">{item.feature.title}</span>
                            <span className="relative mt-1 text-xs opacity-75">{item.feature.text}</span>
                            <span className="relative mt-3 inline-flex items-center gap-1 text-xs font-semibold">
                              {item.feature.cta}
                              <ArrowRight className="size-3.5 transition-transform group-hover/feat:translate-x-1" />
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "hover:bg-accent/60 relative inline-flex h-9 items-center rounded-full px-3 text-sm font-medium transition-colors",
                      pathname === item.href && "bg-accent/60",
                    )}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="hover:bg-accent/60 rounded-full px-3 py-2 text-sm font-medium transition-colors max-lg:hidden">
            Log in
          </Link>
          <Button asChild className="group rounded-full max-sm:hidden">
            <Link href="/signup">
              Join the beta
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>

          {/* Hamburger (mobile) */}
          <button
            className="text-muted-foreground relative flex size-10 lg:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
            <div className="absolute top-1/2 left-1/2 block w-[18px] -translate-x-1/2 -translate-y-1/2">
              <span aria-hidden className={cn("absolute block h-0.5 w-full rounded-full bg-current transition duration-500", isMenuOpen ? "rotate-45" : "-translate-y-1.5")} />
              <span aria-hidden className={cn("absolute block h-0.5 w-full rounded-full bg-current transition duration-500", isMenuOpen && "opacity-0")} />
              <span aria-hidden className={cn("absolute block h-0.5 w-full rounded-full bg-current transition duration-500", isMenuOpen ? "-rotate-45" : "translate-y-1.5")} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="bg-background absolute inset-x-0 top-[calc(100%+0.75rem)] max-h-[calc(100dvh-9rem)] overflow-y-auto rounded-3xl border p-4 shadow-xl lg:hidden"
          >
            <ul className="divide-border divide-y">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="py-1"
                >
                  {"groups" in item ? (
                    <>
                      <button
                        onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
                        aria-expanded={openGroup === item.label}
                        className="flex w-full items-center justify-between px-2 py-3 text-base font-medium"
                      >
                        {item.label}
                        <ChevronDown className={cn("size-4 transition-transform duration-300", openGroup === item.label && "rotate-180")} />
                      </button>
                      <AnimatePresence initial={false}>
                        {openGroup === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 pb-3">
                              {item.groups.map((g) => (
                                <div key={g.label}>
                                  <p className="text-muted-foreground px-2.5 pb-1 text-[11px] font-semibold tracking-wider uppercase">{g.label}</p>
                                  {g.links.map((l) => (
                                    <MenuLink key={l.title} link={l} onClick={() => setIsMenuOpen(false)} />
                                  ))}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link href={item.href} className="block px-2 py-3 text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      {item.label}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/signup">Join the beta</Link>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
