import { redirect } from "next/navigation";

import { SettingsView } from "@/components/dashboard/settings";

export const metadata = { title: "Settings" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  if (tab === "billing") redirect("/dashboard/billing");
  return <SettingsView initialTab={tab} />;
}
