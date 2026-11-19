import { BarChart3 } from "lucide-react";

import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      icon={BarChart3}
      title="Analytics"
      description="See which automations, posts and broadcasts bring you the most leads and replies."
    />
  );
}
