import { siteConfig } from "@/config/site";

export const FAQS: [string, string][] = [
  ["Bagaimana cara top up game?", "Pilih game, isi User ID (dan Zone/Server bila ada), pilih nominal, pasang kode promo bila punya, pilih metode pembayaran, lalu tekan “Lanjutkan Pembayaran”."],
  ["Di mana saya menemukan User ID dan Zone ID?", "Biasanya ada di halaman profil dalam game. Petunjuk singkat tampil di bawah setiap kolom input pada form top up."],
  ["Bagaimana cara memakai kode promo?", "Klik “Pakai Kode” pada banner promo, atau ketik kodenya di langkah Promo saat checkout. Syarat minimal belanja dan cakupan produk ditampilkan otomatis."],
  ["Bagaimana cara mengecek status pesanan?", "Buka Cek Transaksi, masukkan nomor invoice (contoh: INV-240101-AB12C), atau pilih dari riwayat transaksi di perangkat ini."],
  ["Apa saja metode pembayaran yang tersedia?", "Tersedia berbagai metode pembayaran seperti QRIS, e-wallet, virtual account, dan transfer bank."],
];

export const LEGAL: Record<string, { title: string; body: [string, string][] }> = {
  terms: {
    title: "Syarat & Ketentuan",
    body: [
      ["Penggunaan layanan", "Pengguna wajib memasukkan data akun/tujuan dengan benar. Kesalahan input dapat membuat pesanan tidak dapat dibatalkan."],
      ["Harga & promo", "Harga, biaya admin, dan promo dapat berubah sewaktu-waktu."],
      ["Pengembalian dana", "Kebijakan refund akan ditentukan oleh operator platform dan penyedia pembayaran."],
    ],
  },
  privacy: {
    title: "Kebijakan Privasi",
    body: [
      ["Data yang disimpan", "Hanya riwayat transaksi dan nama pengguna yang disimpan di browser Anda. Kata sandi tidak disimpan."],
      ["Menghapus data", "Anda dapat menghapus riwayat lewat tombol “Hapus” di halaman Cek Transaksi atau dengan membersihkan data situs di browser."],
    ],
  },
  contact: {
    title: "Kontak",
    body: [
      ["Email", siteConfig.contact.email],
      ["WhatsApp", siteConfig.contact.whatsapp],
      ["Jam layanan", siteConfig.contact.hours],
    ],
  },
};

export const STATUS = {
  pending: { label: "Menunggu Pembayaran", icon: "fa-clock", desc: "Selesaikan pembayaran agar pesanan dapat diproses." },
  processing: { label: "Diproses", icon: "fa-gear", desc: "Pembayaran diterima. Pesanan sedang diproses." },
  success: { label: "Berhasil", icon: "fa-circle-check", desc: "Pesanan selesai diproses." },
  failed: { label: "Gagal", icon: "fa-circle-xmark", desc: "Pesanan tidak dapat diselesaikan." },
  cancelled: { label: "Dibatalkan", icon: "fa-ban", desc: "Pesanan dibatalkan dan tidak akan diproses." },
} as const;

export const OPERATORS: [string, RegExp][] = [
  ["Telkomsel", /^08(11|12|13|21|22|23|51|52|53)/],
  ["Indosat", /^08(14|15|16|55|56|57|58)/],
  ["XL", /^08(17|18|19|59|77|78)/],
  ["Axis", /^08(31|32|33|38)/],
  ["Tri", /^089[5-9]/],
  ["Smartfren", /^088[1-9]/],
];
