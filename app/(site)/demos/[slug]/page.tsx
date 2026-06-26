import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { demos, getDemo } from "@/lib/demos";

export const dynamicParams = false;

export function generateStaticParams() {
  return demos.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo) return { title: "Demo" };
  return {
    title: `Demo: ${demo.name}`,
    description: `Contoh website ${demo.category} oleh AdamSofi - ${demo.desc}`,
    alternates: { canonical: `/demos/${demo.slug}` },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo) notFound();

  return (
    <div className="demo-view">
      <div className="demo-banner">
        <div className="wrap demo-banner-inner">
          <div className="demo-banner-l">
            <Link href="/portfolio" className="demo-back">← Portfolio</Link>
            <span className="demo-title">
              Demo AdamSofi - <b>{demo.name}</b>
              <span className="demo-cat">{demo.category}</span>
            </span>
          </div>
          <div className="demo-banner-r">
            <a href={`/demos/${demo.slug}.html`} target="_blank" rel="noopener" className="btn btn-gho demo-open">Buka tab penuh ↗</a>
            <Link href="/hubungi" className="btn btn-pri">Bina Website Macam Ni →</Link>
          </div>
        </div>
      </div>
      <iframe
        src={`/demos/${demo.slug}.html`}
        title={demo.name}
        className="demo-frame"
        loading="lazy"
      />
    </div>
  );
}
