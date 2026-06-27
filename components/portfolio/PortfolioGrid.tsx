"use client";

import Link from "next/link";
import { useState } from "react";
import { demos } from "@/lib/demos";
import { lhref, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function PortfolioGrid({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [filter, setFilter] = useState("semua");
  const tt = dict.portfolio.tabs;
  const tabs: { key: string; label: string }[] = [
    { key: "semua", label: tt.semua }, { key: "fnb", label: tt.fnb }, { key: "fesyen", label: tt.fesyen },
    { key: "hartanah", label: tt.hartanah }, { key: "pendidikan", label: tt.pendidikan },
    { key: "elektronik", label: tt.elektronik }, { key: "wellness", label: tt.wellness },
  ];

  return (
    <>
      <div className="tabs">
        {tabs.map((t) => (
          <button key={t.key} className={`tab ${filter === t.key ? "active" : ""}`} onClick={() => setFilter(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="pf-grid">
        {demos.filter((d) => filter === "semua" || d.filter === filter).map((d) => (
          <Link key={d.slug} href={lhref(locale, `/demos/${d.slug}`)} className="pcard">
            <div className={`pthumb ${d.thumb}`}>
              <span className="badge">{d.label}</span>
              {d.name}
            </div>
            <div className="pmeta">
              <div className="cat">{d.category}</div>
              <h3>{d.name}</h3>
              <p>{d.desc}</p>
              <div className="v">{dict.portfolio.lihatDemo}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
