import Link from "next/link";
import { listEbooks } from "@/lib/admin";
import EbookTable from "@/components/admin/EbookTable";

export const dynamic = "force-dynamic";

export default async function AdminEbook() {
  const ebooks = await listEbooks();
  return (
    <div>
      <div className="admin-head-row">
        <h1 className="admin-h1">Ebook</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/ebook/pesanan" className="btn btn-gho">Lihat Pesanan →</Link>
          <Link href="/admin/ebook/baru" className="btn btn-pri">Tambah Ebook Baru →</Link>
        </div>
      </div>
      <div className="admin-panel">
        <EbookTable ebooks={ebooks} />
      </div>
    </div>
  );
}
