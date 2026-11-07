import { MarketingView } from "@/components/dashboard/marketing";

export const metadata = { title: "Marketing" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ goal?: string }>;
}) {
  const { goal } = await searchParams;
  return <MarketingView initialGoal={goal ?? ""} />;
}
