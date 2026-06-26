import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { isAdmin } from "@/lib/session";
import { authConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Only gate when auth is configured; otherwise allow viewing the shell.
  if (authConfigured && !(await isAdmin())) redirect("/admin/login");
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">{children}</div>
    </div>
  );
}
