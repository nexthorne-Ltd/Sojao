import { CreditCard } from "lucide-react";

import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      icon={CreditCard}
      title="Billing"
      description="Plans and invoices will live here. Sojao is free during the beta and nothing is charged."
    />
  );
}
