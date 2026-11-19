import { MarketingView } from "@/components/dashboard/marketing/marketing-view";

export const metadata = { title: "Marketing" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ goal?: string; tab?: string }>;
}) {
  const { goal, tab } = await searchParams;
  return <MarketingView initialGoal={goal ?? ""} initialTab={tab} />;
}
