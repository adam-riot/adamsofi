import Link from "next/link";

/** AdamSofi brand mark. */
export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="logo" aria-label="AdamSofi">
      {/* eslint-disable-next-line @next/next/no-img-element -- vector logo, no raster optimization needed */}
      <img src="/logo-full-dark.svg" alt="AdamSofi" style={{ height: 30, width: "auto" }} />
    </Link>
  );
}
