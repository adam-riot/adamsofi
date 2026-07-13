import { Resend } from "resend";
import { SITE_URL } from "./demos";

const KEY = process.env.RESEND_API_KEY;
export const NEWSLETTER_FROM = process.env.NEWSLETTER_FROM || "AdamSofi <newsletter@adamsofi.com>";
export const CONTACT_TO = process.env.CONTACT_TO || "muhammad.adamx96@gmail.com";

export const hasResend = Boolean(KEY);
export const resend = KEY ? new Resend(KEY) : null;

/** Escapes user-supplied text before interpolating into email HTML (prevents markup/link injection in emails opened by admin or buyers). */
function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ));
}

const shell = (inner: string) => `
<div style="background:#08090d;padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#0f1117;border:1px solid #1f2330;border-radius:16px;overflow:hidden;">
    <div style="padding:26px 32px;border-bottom:1px solid #1f2330;">
      <span style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:20px;color:#fff;">
        <span style="color:#33C9E8;">&lt;</span>A<span style="color:#2F7BEA;">&gt;</span>
      </span>
      <span style="font-weight:700;font-size:19px;color:#fff;margin-left:8px;">adam<span style="color:#22d3ee;">sofi</span><span style="color:#E9B949;">.</span></span>
    </div>
    <div style="padding:32px;color:#cbd2dd;font-size:15px;line-height:1.7;">${inner}</div>
    <div style="padding:20px 32px;border-top:1px solid #1f2330;color:#7d8597;font-size:12px;">
      AdamSofi · Web Development Malaysia · <a href="${SITE_URL}" style="color:#22d3ee;">adamsofi.com</a>
    </div>
  </div>
</div>`;

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#22d3ee,#3b82f6);color:#06121a;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:10px;">${label}</a>`;

export function welcomeEmail(name?: string | null) {
  return shell(`
    <h1 style="font-size:22px;color:#fff;margin:0 0 14px;">Selamat datang ke newsletter AdamSofi! 🎉</h1>
    <p>Hi ${esc(name) || "kawan"},</p>
    <p>Terima kasih subscribe! Anda akan dapat:</p>
    <ul style="padding-left:18px;">
      <li>Artikel terbaru tentang website &amp; bisnes online</li>
      <li>Tips praktikal untuk bisnes Malaysia</li>
      <li>Update pakej dan promosi AdamSofi</li>
    </ul>
    <p style="margin:24px 0;">${btn(`${SITE_URL}/blog`, "Baca Artikel Terbaru →")}</p>
  `);
}

export function broadcastEmail(
  article: { title: string; slug: string; excerpt?: string | null },
  unsubscribeToken: string
) {
  return shell(`
    <p style="font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#22d3ee;">Artikel Baru</p>
    <h1 style="font-size:23px;color:#fff;margin:6px 0 12px;">${esc(article.title)}</h1>
    <p>${esc(article.excerpt) || ""}</p>
    <p style="margin:24px 0;">${btn(`${SITE_URL}/blog/${article.slug}`, "Baca Artikel Penuh →")}</p>
    <p style="font-size:12px;color:#7d8597;">Nak berhenti terima email? <a href="${SITE_URL}/api/unsubscribe?token=${unsubscribeToken}" style="color:#7d8597;">Unsubscribe</a></p>
  `);
}

export function ebookDeliveryEmail(data: { name: string; ebookTitle: string; downloadUrl: string }) {
  return shell(`
    <h1 style="font-size:22px;color:#fff;margin:0 0 14px;">Terima kasih atas pembelian anda! 🎉</h1>
    <p>Hi ${esc(data.name)},</p>
    <p>Pembayaran untuk <b style="color:#fff;">${esc(data.ebookTitle)}</b> telah disahkan. Ebook anda sedia untuk dimuat turun:</p>
    <p style="margin:24px 0;">${btn(data.downloadUrl, "📥 Muat Turun Ebook")}</p>
    <p style="font-size:12px;color:#7d8597;">Simpan email ini - pautan muat turun ini kekal sah untuk anda guna bila-bila masa.</p>
  `);
}

export function inquiryEmail(data: {
  nama: string; whatsapp: string; email: string; bisnes: string;
  pakej: string; addons: string[]; penerangan?: string;
}) {
  return shell(`
    <h1 style="font-size:21px;color:#fff;margin:0 0 14px;">Inquiry Baru - ${esc(data.pakej)}</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;color:#7d8597;">Nama</td><td style="color:#fff;">${esc(data.nama)}</td></tr>
      <tr><td style="padding:6px 0;color:#7d8597;">Bisnes</td><td style="color:#fff;">${esc(data.bisnes)}</td></tr>
      <tr><td style="padding:6px 0;color:#7d8597;">WhatsApp</td><td style="color:#fff;">${esc(data.whatsapp)}</td></tr>
      <tr><td style="padding:6px 0;color:#7d8597;">Emel</td><td style="color:#fff;">${esc(data.email)}</td></tr>
      <tr><td style="padding:6px 0;color:#7d8597;">Pakej</td><td style="color:#fff;">${esc(data.pakej)}</td></tr>
      <tr><td style="padding:6px 0;color:#7d8597;">Add-ons</td><td style="color:#fff;">${esc(data.addons.join(", ")) || "-"}</td></tr>
    </table>
    <p style="margin-top:16px;"><b style="color:#fff;">Penerangan:</b><br>${esc(data.penerangan) || "-"}</p>
    <p style="margin:24px 0;">${btn(`https://wa.me/${data.whatsapp.replace(/\D/g, "")}`, "Reply via WhatsApp →")}</p>
  `);
}
