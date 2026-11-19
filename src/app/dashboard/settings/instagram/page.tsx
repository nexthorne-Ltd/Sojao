import { ConnectInstagram } from "@/components/dashboard/marketing/live/connect-instagram";

export const metadata = { title: "Connect Instagram" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ ig_connected?: string; ig_error?: string }>;
}) {
  const { ig_connected, ig_error } = await searchParams;
  return <ConnectInstagram connected={ig_connected} igError={ig_error} />;
}
