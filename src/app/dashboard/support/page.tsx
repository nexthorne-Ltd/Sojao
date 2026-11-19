import { HeartHandshake } from "lucide-react";

import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      icon={HeartHandshake}
      title="Support"
      description="Sojao will answer order and delivery questions and help with returns after the sale."
    />
  );
}
