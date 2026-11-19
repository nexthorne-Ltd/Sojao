import { ShoppingBag } from "lucide-react";

import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      icon={ShoppingBag}
      title="Sales"
      description="Sojao will answer product questions, suggest the right item and send checkout links right in the chat."
    />
  );
}
