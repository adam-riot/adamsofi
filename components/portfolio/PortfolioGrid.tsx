"use client";

import Link from "next/link";
import { useState } from "react";
import { demos } from "@/lib/demos";

const tabs: { key: string; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "fnb", label: "F&B" },
  { key: "fesyen", label: "Fesyen" },
  { key: "hartanah", label: "Hartanah" },
  { key: "pendidikan", label: "Pendidikan" },
  { key: "elektronik", label: "Elektronik" },
  { key: "wellness", label: "Wellness" },
];

export default function PortfolioGrid() {
  const [filter, setFilter] = useState("semua");
  return (
    <>
      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`tab ${filter === t.key ? "active" : ""}`}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pf-grid">
        {demos
          .filter((d) => filter === "semua" || d.filter === filter)
          .map((d) => (
            <Link key={d.slug} href={`/demos/${d.slug}`} className="pcard">
              <div className={`pthumb ${d.thumb}`}>
                <span className="badge">{d.label}</span>
                {d.name}
              </div>
              <div className="pmeta">
                <div className="cat">{d.category}</div>
                <h3>{d.name}</h3>
                <p>{d.desc}</p>
                <div className="v">Lihat Demo →</div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
