import { AnnouncementBar } from "@/components/announcement-bar";
import { AskBar } from "@/components/ask-bar";
import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";

/** Marketing-site frame: top bar, navbar, footer and the floating ask bar. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pt-10 pb-24">
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AskBar />
    </div>
  );
}
