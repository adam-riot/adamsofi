import { getDashboardData } from "@/lib/admin";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const d = await getDashboardData();
  const maxView = Math.max(1, ...d.views7.map((v) => v.count));

  const cards = [
    { label: "Artikel", main: d.articles.published + d.articles.draft, sub: `${d.articles.published} published · ${d.articles.draft} draft` },
    { label: "Subscribers", main: d.subscribers.active, sub: `${d.subscribers.unsubscribed} unsubscribed` },
    { label: "Inquiries", main: d.inquiries.total, sub: `${d.inquiries.new} baru` },
    { label: "Page Views (7h)", main: d.views7.reduce((s, v) => s + v.count, 0), sub: "7 hari terakhir" },
  ];

  return (
    <div>
      <h1 className="admin-h1">Dashboard</h1>

      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-label">{c.label}</div>
            <div className="stat-main">{c.main}</div>
            <div className="stat-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="admin-panel">
        <h2 className="admin-h2">Page Views — 7 Hari</h2>
        <div className="chart">
          {d.views7.map((v) => (
            <div className="chart-col" key={v.day}>
              <div className="chart-bar" style={{ height: `${(v.count / maxView) * 100}%` }} title={`${v.count}`} />
              <span className="chart-lbl">{v.day.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-two">
        <div className="admin-panel">
          <h2 className="admin-h2">Inquiries Terbaru</h2>
          {d.recentInquiries.length === 0 ? <p className="admin-empty">Tiada lagi.</p> : (
            <table className="admin-table">
              <thead><tr><th>Bisnes</th><th>Pakej</th><th>Status</th></tr></thead>
              <tbody>
                {d.recentInquiries.map((i) => (
                  <tr key={i.id}><td>{i.bisnes}</td><td>{i.pakej}</td><td><span className={`badge-st st-${i.status}`}>{i.status}</span></td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="admin-panel">
          <h2 className="admin-h2">Subscribers Terbaru</h2>
          {d.recentSubscribers.length === 0 ? <p className="admin-empty">Tiada lagi.</p> : (
            <table className="admin-table">
              <thead><tr><th>Emel</th><th>Tarikh</th></tr></thead>
              <tbody>
                {d.recentSubscribers.map((s) => (
                  <tr key={s.id}><td>{s.email}</td><td>{formatDate(s.subscribed_at)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
