# Kaizora Digital — Aturan Tetap (AGENTS)

## 3. Struktur kode (rapi dan modular, gampang ditambah fitur)
- `app/` hanya berisi route yang tipis. `components/ui` untuk komponen dasar, `components/sections` untuk blok halaman, `lib/` untuk logic dan data, `types/` untuk tipe, `config/site.ts` untuk brand, kontak, dan setting.
- Data (game, PPOB, pembayaran, promo, FAQ) tetap di `lib`, dipisah per file. Akses data lewat fungsi di `lib`, bukan langsung dari komponen.
- Satu file satu tanggung jawab, maksimal sekitar 200 baris. Hapus kode duplikat dan dependensi yang tidak dipakai. Tanpa `any`.
- Warna, radius, dan font lewat CSS variables.

## 4. Optimasi (hemat bandwidth Vercel dan ringan)
- Tanpa ISR, tanpa `revalidate`, tanpa middleware, tanpa route handler, tanpa API route.
- Gambar: optimasi sendiri ke WebP/AVIF dengan ukuran sesuai tampilan (kecuali QR), simpan di `public/`. Set `images.unoptimized: true`. Logo dan ikon pakai SVG. Gambar di bawah fold lazy load, hero pakai prioritas tinggi (`priority`/eager bila perlu).
- Font Awesome webfont dibuang. Ganti ke SVG inline atau ikon per-item (hanya yang dipakai). Font teks lewat `next/font` (subset latin, maksimal 2 family).
- JS sekecil mungkin: modal (Order, Invoice, Auth, Pembayaran) dan komponen berat pakai dynamic import. Animasi pakai CSS. Hindari library besar.
- Link di daftar panjang (katalog game, grid PPOB) pakai `prefetch={false}`.
- Header cache panjang (immutable) untuk aset di `public/` lewat `next.config`.
- Jangan aktifkan Vercel Analytics atau Speed Insights.
- Metadata API per halaman, `robots.txt`, dan sitemap statis.
