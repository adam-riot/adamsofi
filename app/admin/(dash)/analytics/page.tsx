import { getAnalytics } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminAnalytics() {
  const a = await getAnalytics();
  const pakejEntries = Object.entries(a.byPakej).sort((x, y) => y[1] - x[1]);
  const maxPakej = Math.max(1, ...pakejEntries.map(([, n]) => n));

  return (
    <div>
      <h1 className="admin-h1">Analytics</h1>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total Page Views</div><div className="stat-main">{a.totalViews}</div></div>
        <div className="stat-card"><div className="stat-label">Total Inquiries</div><div className="stat-main">{a.inquiries.length}</div></div>
        <div className="stat-card"><div className="stat-label">Artikel Published</div><div className="stat-main">{a.topArticles.length}</div></div>
      </div>

      <div className="admin-two">
        <div className="admin-panel">
          <h2 className="admin-h2">Top Artikel (Views)</h2>
          {a.topArticles.length === 0 ? <p className="admin-empty">Tiada data.</p> : (
            <table className="admin-table">
              <thead><tr><th>Tajuk</th><th>Views</th></tr></thead>
              <tbody>{a.topArticles.map((t) => (<tr key={t.id}><td>{t.title}</td><td>{t.views}</td></tr>))}</tbody>
            </table>
          )}
        </div>
        <div className="admin-panel">
          <h2 className="admin-h2">Top Pages</h2>
          {a.topPages.length === 0 ? <p className="admin-empty">Belum ada tracking.</p> : (
            <table className="admin-table">
              <thead><tr><th>Page</th><th>Views</th></tr></thead>
              <tbody>{a.topPages.map((p) => (<tr key={p.page}><td>{p.page}</td><td>{p.count}</td></tr>))}</tbody>
            </table>
          )}
        </div>
      </div>

      <div className="admin-panel">
        <h2 className="admin-h2">Inquiries Ikut Pakej</h2>
        {pakejEntries.length === 0 ? <p className="admin-empty">Tiada inquiry lagi.</p> : (
          <div className="hbars">
            {pakejEntries.map(([pakej, n]) => (
              <div className="hbar-row" key={pakej}>
                <span className="hbar-lbl">{pakej}</span>
                <div className="hbar-track"><div className="hbar-fill" style={{ width: `${(n / maxPakej) * 100}%` }} /></div>
                <span className="hbar-val">{n}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
