"use client";

import { useState } from "react";

export type QA = { q: string; a: string };

export default function FAQ({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq">
      {items.map((it, i) => (
        <div key={i} className={`qi ${open === i ? "open" : ""}`}>
          <div className="qh" onClick={() => setOpen(open === i ? null : i)}>
            {it.q}<span className="pl">+</span>
          </div>
          <div className="qb"><p>{it.a}</p></div>
        </div>
      ))}
    </div>
  );
}
