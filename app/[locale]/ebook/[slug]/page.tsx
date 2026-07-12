import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEbookBySlug } from "@/lib/ebooks";
import { formatRM } from "@/lib/utils";
import { SITE_URL } from "@/lib/demos";
import EbookBuyForm from "@/components/ebook/EbookBuyForm";
import { type Locale, isLocale, lhref, alternates } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const ebook = await getEbookBySlug(slug);
  if (!ebook) return { title: "404" };
  return {
    title: `${ebook.title} - AdamSofi`,
    description: ebook.description || undefined,
    alternates: alternates(locale, `/ebook/${ebook.slug}`),
    openGraph: {
      type: "website",
      title: ebook.title,
      description: ebook.description || "",
      url: `${SITE_URL}${lhref(locale, `/ebook/${ebook.slug}`)}`,
      images: ebook.cover_url ? [ebook.cover_url] : ["/og-image.png"],
    },
  };
}

export default async function EbookDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const dict = getDict(locale);
  const t = dict.ebook;
  const ebook = await getEbookBySlug(slug);
  if (!ebook) notFound();

  return (
    <article className="post">
      <div className="wrap post-wrap">
        <Link href={lhref(locale, "/ebook")} className="post-back">{t.backEbook}</Link>
        <div className="post-head">
          <h1>{ebook.title}</h1>
        </div>

        {ebook.cover_url && (
          <div className="post-cover">
            <Image src={ebook.cover_url} alt={ebook.title} width={1200} height={630} style={{ width: "100%", height: "auto" }} />
          </div>
        )}

        {ebook.description && (
          <div className="post-content" style={{ whiteSpace: "pre-wrap" }}>{ebook.description}</div>
        )}

        <div className="form-card" style={{ maxWidth: 480, margin: "40px auto 0" }}>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 18, textAlign: "center" }}>
            {t.hargaLabel}: {formatRM(ebook.price)}
          </div>
          <EbookBuyForm ebookId={ebook.id} locale={locale} dict={dict} />
        </div>
      </div>
    </article>
  );
}
