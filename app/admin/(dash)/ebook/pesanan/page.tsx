import { listEbookOrders } from "@/lib/admin";
import EbookOrderTable from "@/components/admin/EbookOrderTable";

export const dynamic = "force-dynamic";

export default async function AdminEbookOrders() {
  const orders = await listEbookOrders();
  return (
    <div>
      <h1 className="admin-h1">Pesanan Ebook</h1>
      <div className="admin-panel">
        {orders.length === 0 ? (
          <p className="admin-empty">Tiada pesanan lagi.</p>
        ) : (
          <EbookOrderTable orders={orders} />
        )}
      </div>
    </div>
  );
}
