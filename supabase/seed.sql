-- Seed: 5 published articles. Run after 001_init.sql.
INSERT INTO articles (title, slug, excerpt, content, category, tags, status, published_at) VALUES
(
  'Kenapa Bisnes Malaysia Perlu Website Sekarang',
  'kenapa-bisnes-malaysia-perlu-website',
  'Pelanggan zaman ni Google dulu sebelum beli. Kalau bisnes anda tak ada online presence, anda dah kalah sebelum bertanding.',
  '<h2>Realiti 2026</h2><p>Lebih 90% pengguna internet di Malaysia akan cari maklumat bisnes secara online sebelum membuat keputusan. Kalau bisnes anda tak wujud dalam carian, anda hilang pelanggan setiap hari tanpa sedar.</p><h2>Website vs Media Sosial</h2><p>Media sosial penting, tapi ia bukan milik anda — algoritma berubah, akaun boleh kena banned. Website adalah aset digital yang anda kawal sepenuhnya, 24 jam, tanpa bergantung pada platform lain.</p><h2>Mula Dengan Yang Kecil</h2><p>Anda tak perlu website besar. Satu landing page yang kemas dengan butang WhatsApp sudah cukup untuk mula menukar pelawat jadi pelanggan.</p>',
  'Bisnes Online',
  ARRAY['website','bisnes','malaysia'],
  'published',
  NOW() - INTERVAL '1 day'
),
(
  'Berapa Kos Sebenar Buat Website untuk Bisnes Kecil',
  'kos-buat-website-bisnes-kecil-malaysia',
  'Ramai sangka website mahal. Tapi kalau tahu cara, landing page profesional boleh siap dari RM500.',
  '<h2>Breakdown Kos</h2><p>Kos website bergantung pada skop. Landing page satu halaman jauh lebih murah daripada sistem e-commerce penuh. Untuk kebanyakan bisnes kecil, landing page sudah memadai.</p><h2>Apa Yang Anda Bayar</h2><p>Domain, hosting, reka bentuk, dan penyelenggaraan. Sesetengah disatukan dalam pakej, sesetengah berasingan. Pastikan anda faham apa yang termasuk.</p><h2>Pelaburan, Bukan Belanja</h2><p>Website yang baik membayar balik dirinya melalui pelanggan baru. Fikirkan ia sebagai jurujual yang bekerja 24 jam.</p>',
  'Tips Website',
  ARRAY['kos','harga','website'],
  'published',
  NOW() - INTERVAL '2 days'
),
(
  'Apa Beza Landing Page dengan Website Biasa',
  'beza-landing-page-website',
  'Ramai confuse antara dua ni. Simple je sebenarnya — fungsi lain, tujuan lain.',
  '<h2>Landing Page</h2><p>Satu halaman fokus dengan satu matlamat — biasanya menukar pelawat kepada lead atau jualan. Ringkas, pantas, dan terus ke point.</p><h2>Website Biasa</h2><p>Beberapa halaman dengan pelbagai fungsi — tentang kami, servis, blog, hubungi. Sesuai bila anda perlu kandungan yang lebih luas.</p><h2>Mana Satu Untuk Anda?</h2><p>Baru mula? Landing page. Dah berkembang dan perlu lebih banyak kandungan? Website penuh. Anda boleh mula kecil dan naik taraf kemudian.</p>',
  'Tips Website',
  ARRAY['landing page','website'],
  'published',
  NOW() - INTERVAL '3 days'
),
(
  'Cara Setup Google My Business untuk Bisnes Tempatan',
  'cara-setup-google-my-business',
  'Google My Business percuma dan powerful untuk bisnes yang target pelanggan tempatan. Ini cara setup dalam 15 minit.',
  '<h2>Langkah 1: Daftar</h2><p>Pergi ke Google Business Profile dan daftar dengan akaun Google anda. Masukkan nama bisnes dan kategori.</p><h2>Langkah 2: Verify</h2><p>Google akan hantar kod verifikasi melalui pos atau telefon. Masukkan kod untuk sahkan pemilikan.</p><h2>Langkah 3: Lengkapkan Profil</h2><p>Tambah alamat, waktu operasi, foto, dan nombor telefon. Profil yang lengkap muncul lebih tinggi dalam carian tempatan.</p>',
  'Tutorial',
  ARRAY['google','seo','tempatan'],
  'published',
  NOW() - INTERVAL '4 days'
),
(
  'Domain .my vs .com — Mana Lebih Baik untuk Bisnes Malaysia',
  'domain-my-vs-com-bisnes-malaysia',
  'Soalan paling common dari client. Jawapan bergantung pada target market anda.',
  '<h2>Perbezaan Utama</h2><p>.com adalah pilihan global yang dikenali di mana-mana. .my menunjukkan identiti Malaysia yang jelas dan boleh bina kepercayaan tempatan.</p><h2>Bila Pilih .my</h2><p>Kalau pelanggan anda majoriti di Malaysia dan anda nak tonjolkan identiti tempatan, .my pilihan bagus.</p><h2>Bila Pilih .com</h2><p>Kalau anda sasarkan pasaran antarabangsa atau nak fleksibiliti, .com lebih universal. Ramai bisnes ambil kedua-duanya untuk lindungi jenama.</p>',
  'Tips Website',
  ARRAY['domain','branding'],
  'published',
  NOW() - INTERVAL '5 days'
)
ON CONFLICT (slug) DO NOTHING;
