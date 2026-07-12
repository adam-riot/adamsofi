import Link from "next/link";
import type { Metadata } from "next";
import { getOrderStatus } from "@/lib/ebooks";
import { type Locale, isLocale, lhref } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = { title: "Terima Kasih", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EbookThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const t = getDict(locale).ebook.thankYou;
  const { order: orderId } = await searchParams;
  const order = orderId ? await getOrderStatus(orderId) : null;

  const home = lhref(locale, "/ebook");

  if (!order) {
    return (
      <section className="final">
        <div className="wrap">
          <div className="final-box">
            <div className="inner">
              <h2>{t.notFoundTitle}</h2>
              <p>{t.notFoundP}</p>
              <Link href={home} className="btn btn-pri">{getDict(locale).ebook.backEbook}</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (order.status === "paid") {
    return (
      <section className="final">
        <div className="wrap">
          <div className="final-box">
            <div className="inner">
              <h2>{t.paidTitle}</h2>
              <p>{t.paidP}</p>
              <a href={`/api/ebook/download/${order.downloadToken}`} className="btn btn-pri">{t.downloadBtn}</a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <meta httpEquiv="refresh" content="4" />
      <section className="final">
        <div className="wrap">
          <div className="final-box">
            <div className="inner">
              <h2>{t.pendingTitle}</h2>
              <p>{t.pendingP}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
