import { AdminUsers } from "@/components/admin/users";

export const metadata = { title: "Users" };

export default async function Page({ searchParams }: { searchParams: Promise<{ u?: string }> }) {
  const { u } = await searchParams;
  return <AdminUsers initialId={u ?? null} />;
}
