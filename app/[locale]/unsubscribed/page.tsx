import Link from "next/link";
import type { Metadata } from "next";
import { type Locale, isLocale, lhref } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false } };

export default async function Unsubscribed({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const t = getDict(locale).unsub;
  const { ok } = await searchParams;
  const success = ok !== "0";
  return (
    <section className="final">
      <div className="wrap">
        <div className="final-box">
          <div className="inner">
            <h2>{success ? t.okH : t.failH}</h2>
            <p>{success ? t.okP : t.failP}</p>
            <Link href={lhref(locale, "/")} className="btn btn-pri">{t.back}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
