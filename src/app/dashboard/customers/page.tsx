import { CustomersView } from "@/components/dashboard/customers";

export const metadata = { title: "Customers" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  return <CustomersView initialId={c ?? null} />;
}
