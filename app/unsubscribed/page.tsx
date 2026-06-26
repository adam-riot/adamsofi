import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false } };

export default async function Unsubscribed({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const success = ok !== "0";
  return (
    <section className="final">
      <div className="wrap">
        <div className="final-box">
          <div className="inner">
            <h2>{success ? "Anda telah unsubscribe" : "Pautan tidak sah"}</h2>
            <p>
              {success
                ? "Anda tidak akan terima email newsletter lagi. Terima kasih kerana pernah bersama kami."
                : "Token unsubscribe tidak dijumpai atau telah tamat tempoh."}
            </p>
            <Link href="/" className="btn btn-pri">Kembali ke Utama →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
