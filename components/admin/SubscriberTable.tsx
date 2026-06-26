"use client";

import { useMemo, useState } from "react";
import type { Subscriber } from "@/lib/admin";
import { formatDate } from "@/lib/utils";

export default function SubscriberTable({ subscribers }: { subscribers: Subscriber[] }) {
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");

  const rows = useMemo(
    () => subscribers.filter((s) => filter === "all" || s.status === filter),
    [subscribers, filter]
  );

  function exportCsv() {
    const head = ["email", "name", "status", "subscribed_at"];
    const lines = [head.join(",")].concat(
      rows.map((s) =>
        [s.email, s.name || "", s.status, s.subscribed_at].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `subscribers-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="admin-toolbar">
        <div className="tabs">
          {(["all", "active", "unsubscribed"] as const).map((f) => (
            <button key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "Semua" : f === "active" ? "Active" : "Unsubscribed"}
            </button>
          ))}
        </div>
        <button className="btn btn-gho" onClick={exportCsv}>Export CSV</button>
      </div>
      {rows.length === 0 ? <p className="admin-empty">Tiada subscriber.</p> : (
        <table className="admin-table">
          <thead><tr><th>Emel</th><th>Nama</th><th>Status</th><th>Tarikh</th></tr></thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id}>
                <td>{s.email}</td><td>{s.name || "-"}</td>
                <td><span className={`badge-st ${s.status === "active" ? "st-pub" : "st-draft"}`}>{s.status}</span></td>
                <td>{formatDate(s.subscribed_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
