"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function ShareButtons({ url, title, dict }: { url: string; title: string; dict: Dict }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* noop */ }
  };
  const wa = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const threads = `https://www.threads.net/intent/post?text=${encodeURIComponent(`${title} ${url}`)}`;
  return (
    <div className="share">
      <span>{dict.blog.share}</span>
      <a href={wa} target="_blank" rel="noopener" className="share-btn">WhatsApp</a>
      <a href={threads} target="_blank" rel="noopener" className="share-btn">Threads</a>
      <button className="share-btn" onClick={copy}>{copied ? dict.blog.copied : dict.blog.copy}</button>
    </div>
  );
}
