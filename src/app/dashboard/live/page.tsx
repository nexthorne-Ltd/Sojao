import { Cctv } from "lucide-react";

import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      icon={Cctv}
      title="Sojao Live"
      description="Watch Sojao reply to your customers in real time, like checking your shop cameras."
    />
  );
}
