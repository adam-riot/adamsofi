# Lead Pipeline Playbook

## Niche pertama: F&B (kafe, restoran, warung tomyam)

Kenapa F&B dulu:
- Demo paling kuat dah siap: `restoran-tomyam` dan `cafe-kopi-lembah` (2 daripada 10 demo).
- Budaya order/tanya melalui WhatsApp memang dah wujud dalam F&B - website terus-WhatsApp adalah pitch semula jadi.
- Padat dengan SME tanpa website: cari di Google Maps kawasan Sungai Besar / Sabak Bernam / Kuala Selangor, filter yang tiada website.
- Pakej Starter RM500 sepadan dengan bajet F&B kecil, dan menu + lokasi + butang WA cukup untuk satu halaman.

Niche kedua nanti: barbershop/salon (demo `barbershop-blade` sedia), kemudian klinik/gym.

## Workflow batch demo

1. Kumpul 5-10 prospek dari Google Maps: nama bisnes, nombor telefon, ada/tiada website.
2. Jana demo peribadi untuk setiap prospek:

   ```bash
   node scripts/new-demo.mjs restoran-tomyam tomyam-pakcik-man "Tom Yam Pak Cik Man" 60123456789
   ```

   - Base template: mana-mana slug dalam `lib/demos.ts` (`restoran-tomyam`, `cafe-kopi-lembah`, dll).
   - Output: `public/demos/leads/<slug>.html`. Butang WA dalam demo akan point ke nombor prospek sendiri, jadi bila dia tekan dia nampak ia berfungsi.
3. Commit + push (Vercel auto-deploy). Link share: `https://adamsofi.com/demos/leads/<slug>.html`
4. Folder `/demos/leads/` di-disallow dalam robots.txt - ia untuk pitching sahaja, tidak masuk Google.
5. Lepas prospek jawab (deal atau tolak), padam fail demo dan push semula supaya folder kekal bersih.

## Template mesej outreach (WhatsApp)

> Salam, saya Adam. Saya perasan [nama bisnes] belum ada website. Saya dah buatkan draf ringkas untuk tengok macam mana ia boleh nampak: [link]. Kalau berkenan boleh saya siapkan versi penuh - draf ni percuma, tiada komitmen.

Follow-up selepas 2-3 hari kalau tiada jawapan, sekali sahaja.

## Tracking

Semua klik WhatsApp di site direkod dalam table `page_views` (Neon) dan muncul di `/admin/analytics` bawah "Top Pages":

| Page dalam analytics | Sumber klik |
|---|---|
| `wa:hero` | Butang utama homepage |
| `wa:home-final` | CTA akhir homepage |
| `wa:form` | Link "WhatsApp terus" bawah borang hubungi |
| `wa:form-success` | Butang WA selepas borang berjaya dihantar |
| `wa:float` | Butang hijau terapung |
| `wa:demo-<slug>` | Butang "Bina Website Macam Ni" di halaman demo |

## GBP + GSC checklist (tindakan manual, sekali sahaja)

Google Business Profile (business.google.com):
1. Cipta profil "AdamSofi" kategori "Website designer" / "Internet marketing service".
2. Jenis: Service Area Business (tak perlu dedah alamat rumah) - set kawasan servis, contoh Selangor / seluruh Malaysia.
3. Isi: website adamsofi.com, telefon 018-2399476, waktu operasi Isnin-Jumaat 9am-6pm, Sabtu 10am-2pm (sama dengan halaman hubungi).
4. Selepas verified: minta 2-3 pelanggan sebenar tinggalkan review Google.
5. Nota schema: JSON-LD homepage sekarang ada address `addressCountry: MY` sahaja. Selepas GBP siap, tambah `addressLocality`/`addressRegion` yang sama dalam `app/[locale]/page.tsx` supaya konsisten.

Google Search Console (search.google.com/search-console):
1. Add property `https://adamsofi.com` (jenis URL prefix).
2. Pilih kaedah "HTML tag", salin content value.
3. `vercel env add GOOGLE_SITE_VERIFICATION` (production), paste value, redeploy - layout akan render meta tag secara automatik.
4. Tekan Verify, kemudian submit sitemap: `https://adamsofi.com/sitemap.xml`.
