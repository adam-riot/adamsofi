import { listSubscribers } from "@/lib/admin";
import SubscriberTable from "@/components/admin/SubscriberTable";

export const dynamic = "force-dynamic";

export default async function AdminSubscribers() {
  const subscribers = await listSubscribers();
  const active = subscribers.filter((s) => s.status === "active").length;
  return (
    <div>
      <h1 className="admin-h1">Subscribers</h1>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total</div><div className="stat-main">{subscribers.length}</div></div>
        <div className="stat-card"><div className="stat-label">Active</div><div className="stat-main">{active}</div></div>
        <div className="stat-card"><div className="stat-label">Unsubscribed</div><div className="stat-main">{subscribers.length - active}</div></div>
      </div>
      <div className="admin-panel">
        <SubscriberTable subscribers={subscribers} />
      </div>
    </div>
  );
}
