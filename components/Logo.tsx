import Link from "next/link";

/** AdamSofi brand mark: <A> code icon + adamsofi. wordmark. */
export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label="AdamSofi">
      <span className="mk">
        <span className="gd" />
        <span className="ag">&lt;</span>
        <span className="ax">A</span>
        <span className="ag r">&gt;</span>
      </span>
      <span className="word">
        adam<span className="g">sofi</span><span className="pd">.</span>
      </span>
    </Link>
  );
}
