import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";

/**
 * Marketing-site frame: top bar, navbar and footer.
 * The floating "Type a goal" bar lives in the dashboard only.
 * Bottom padding leaves room for the corner theme button so it never
 * covers the last footer line.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pt-10 pb-20">
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
