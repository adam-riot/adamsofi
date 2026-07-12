"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/artikel", label: "Artikel", icon: "✎" },
  { href: "/admin/ebook", label: "Ebook", icon: "📘" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "✉" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "☎" },
  { href: "/admin/analytics", label: "Analytics", icon: "📊" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch { /* noop */ }
    router.push("/admin/login");
    router.refresh();
  }

  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="admin-side">
      <Link href="/admin" className="logo admin-logo">
        <span className="mk"><span className="gd" /><span className="ag">&lt;</span><span className="ax">A</span><span className="ag r">&gt;</span></span>
        <span className="word">admin</span>
      </Link>
      <nav className="admin-nav">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className={active(it.href) ? "active" : ""}>
            <span className="ai">{it.icon}</span> {it.label}
          </Link>
        ))}
      </nav>
      <div className="admin-side-foot">
        <Link href="/" className="admin-view">↗ Lihat site</Link>
        <button onClick={signOut} className="admin-signout">Log keluar</button>
      </div>
    </aside>
  );
}
