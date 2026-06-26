import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { createSupabaseServer, hasSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (hasSupabase) {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
  }
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">{children}</div>
    </div>
  );
}
