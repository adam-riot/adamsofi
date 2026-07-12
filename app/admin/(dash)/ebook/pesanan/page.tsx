import { listEbookOrders } from "@/lib/admin";
import { formatDate, formatRM } from "@/lib/utils";

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
          <table className="admin-table">
            <thead><tr><th>Pembeli</th><th>Ebook</th><th>Jumlah</th><th>Status</th><th>Tarikh</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.buyer_name}<br /><span style={{ color: "var(--mute)", fontSize: 13 }}>{o.buyer_email}</span></td>
                  <td>{o.ebook_title}</td>
                  <td>{formatRM(o.amount)}</td>
                  <td><span className={`badge-st ${o.status === "paid" ? "st-pub" : "st-draft"}`}>{o.status}</span></td>
                  <td>{formatDate(o.paid_at || o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
