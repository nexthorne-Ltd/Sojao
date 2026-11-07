import { InboxView } from "@/components/dashboard/inbox";

export const metadata = { title: "Inbox" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  return <InboxView initialId={c ?? null} />;
}
