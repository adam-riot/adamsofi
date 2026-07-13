import crypto from "crypto";

const API_KEY = process.env.BILLPLZ_API_KEY || "";
const COLLECTION_ID = process.env.BILLPLZ_COLLECTION_ID || "";
const X_SIGNATURE_KEY = process.env.BILLPLZ_X_SIGNATURE_KEY || "";
const BASE = "https://www.billplz.com";

export const hasBillplz = Boolean(API_KEY && COLLECTION_ID && X_SIGNATURE_KEY);

export type BillplzBill = { id: string; url: string };

export async function createBill(input: {
  name: string;
  email: string;
  mobile?: string;
  amount: number; // sen
  description: string;
  referenceId: string;
  callbackUrl: string;
  redirectUrl: string;
}): Promise<BillplzBill> {
  const body = new URLSearchParams({
    collection_id: COLLECTION_ID,
    email: input.email,
    name: input.name,
    amount: String(input.amount),
    description: input.description,
    callback_url: input.callbackUrl,
    redirect_url: input.redirectUrl,
    reference_1_label: "Order",
    reference_1: input.referenceId,
    ...(input.mobile ? { mobile: input.mobile } : {}),
  });

  const res = await fetch(`${BASE}/api/v3/bills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${API_KEY}:`).toString("base64"),
    },
    body,
  });

  if (!res.ok) throw new Error(`Billplz create bill failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return { id: data.id, url: data.url };
}

/**
 * Verifies a Billplz X-Signature. Works for both the callback payload (plain
 * field names) and the redirect query params (`billplz[id]` etc — brackets
 * are stripped before concatenating, matching Billplz's algorithm).
 * Source string = all fields except x_signature, each pair concatenated as
 * `key+value` with no separator, THEN those combined strings are sorted
 * (case-insensitive, plain ASCII order) and joined by "|". Sorting the
 * combined string (not the bare key) matters: it's why "paid_amount" and
 * "paid_at" sort before bare "paid" — "paid"+"true" becomes "paidtrue", and
 * "_" sorts before "t" at the position where they diverge.
 */
export function verifySignature(fields: Record<string, string>, receivedSig: string): boolean {
  if (!X_SIGNATURE_KEY || !receivedSig) return false;

  const source = Object.keys(fields)
    .filter((k) => !k.toLowerCase().includes("x_signature"))
    .map((k) => `${k.replace(/[[\]]/g, "")}${fields[k]}`)
    .sort((a, b) => {
      const la = a.toLowerCase(), lb = b.toLowerCase();
      return la < lb ? -1 : la > lb ? 1 : 0;
    })
    .join("|");

  const expected = crypto.createHmac("sha256", X_SIGNATURE_KEY).update(source).digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(receivedSig, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
