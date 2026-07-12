import Link from "next/link";
import type { Ebook } from "@/lib/ebooks";
import { formatRM } from "@/lib/utils";
import { lhref, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function EbookCard({ ebook, locale, dict }: { ebook: Ebook; locale: Locale; dict: Dict }) {
  return (
    <Link href={lhref(locale, `/ebook/${ebook.slug}`)} className="acard">
      <div className="acard-cover" style={ebook.cover_url ? { backgroundImage: `url(${ebook.cover_url})` } : undefined}>
        {!ebook.cover_url && <span className="acard-mono">📘</span>}
        <span className="acard-cat">{formatRM(ebook.price)}</span>
      </div>
      <div className="acard-body">
        <h3>{ebook.title}</h3>
        <p>{ebook.description}</p>
        <span className="acard-link">{dict.ebook.lihatBtn}</span>
      </div>
    </Link>
  );
}
