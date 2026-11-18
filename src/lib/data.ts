import type { Payment, Promo, Service, PromoSlide, ServiceKind } from "./types";

export const CONFIG = {
  storageKey: "kaizora.tx.v1",
  userKey: "kaizora.user.v1",
  locale: "id-ID",
} as const;

const rows = (prefix: string, list: [string, number, string?][]) =>
  list.map(([label, price, tag], i) => ({ id: `${prefix}-${i + 1}`, label, price, tag }));

const nominal = (n: number) => "Rp" + n.toLocaleString("id-ID");

const FIELD_PHONE = {
  id: "phone",
  label: "Nomor HP",
  ph: "08123456789",
  inputmode: "tel",
  maxlength: 14,
  rule: { type: "phone" as const },
  detect: true,
  hint: "Contoh: 08123456789",
};

const GAMES_BASE: Omit<Service, "subtitle">[] = [
  {
    id: "mlbb", kind: "game", name: "Mobile Legends: Bang Bang", short: "Mobile Legends", aliases: ["mlbb", "ml"],
    category: "MOBA", currency: "Diamonds", popular: true, rank: 1,
    layout: "split", stepTitle: "Data Akun", icon: "fa-gem",
    fields: [
      { id: "userId", label: "User ID", ph: "Contoh: 12345678", inputmode: "numeric", maxlength: 12, rule: { type: "digits", min: 7, max: 12 }, hint: "Lihat di profil game." },
      { id: "zoneId", label: "Zone ID", ph: "1234", inputmode: "numeric", maxlength: 5, rule: { type: "digits", min: 3, max: 5 }, hint: "Angka dalam kurung." },
    ],
    products: rows("mlbb", [["3 Diamonds", 1000], ["12 Diamonds", 3500], ["28 Diamonds", 7500], ["59 Diamonds", 15000, "Populer"], ["86 Diamonds", 21500, "Terlaris"], ["172 Diamonds", 42500], ["257 Diamonds", 63000], ["706 Diamonds", 172000], ["Weekly Diamond Pass", 27500, "Hemat"]]),
  },
  {
    id: "freefire", kind: "game", name: "Free Fire", short: "Free Fire", aliases: ["ff"],
    category: "Battle Royale", currency: "Diamonds", popular: true, rank: 2,
    stepTitle: "Data Akun", icon: "fa-gem",
    fields: [{ id: "userId", label: "Player ID", ph: "Contoh: 123456789", inputmode: "numeric", maxlength: 12, rule: { type: "digits", min: 8, max: 12 }, hint: "Ada di profil / lobi game." }],
    products: rows("freefire", [["5 Diamonds", 1000], ["50 Diamonds", 7500], ["70 Diamonds", 10000], ["140 Diamonds", 19500, "Populer"], ["355 Diamonds", 48500], ["720 Diamonds", 96000], ["1450 Diamonds", 190000], ["Membership Mingguan", 29000, "Hemat"]]),
  },
  {
    id: "pubgm", kind: "game", name: "PUBG Mobile", short: "PUBG Mobile", aliases: ["pubg", "pubgm"],
    category: "Battle Royale", currency: "UC", popular: true, rank: 3,
    stepTitle: "Data Akun", icon: "fa-gem",
    fields: [{ id: "userId", label: "Character ID", ph: "Contoh: 5123456789", inputmode: "numeric", maxlength: 12, rule: { type: "digits", min: 8, max: 12 }, hint: "Ketuk avatar di game untuk melihat ID." }],
    products: rows("pubgm", [["60 UC", 15000], ["325 UC", 78000], ["660 UC", 155000, "Populer"], ["1800 UC", 400000], ["3850 UC", 800000], ["8100 UC", 1600000]]),
  },
  {
    id: "genshin", kind: "game", name: "Genshin Impact", short: "Genshin Impact", aliases: ["gi", "genshin"],
    category: "RPG", currency: "Genesis Crystals", popular: true, rank: 4,
    layout: "split", stepTitle: "Data Akun", icon: "fa-gem",
    fields: [
      { id: "uid", label: "UID", ph: "8xxxxxxxx", inputmode: "numeric", maxlength: 10, rule: { type: "digits", min: 9, max: 10 }, hint: "9–10 digit, ada di pojok layar." },
      { id: "server", label: "Server", type: "select", options: ["Asia", "America", "Europe", "TW/HK/MO"] },
    ],
    products: rows("genshin", [["60 Genesis Crystals", 16000], ["300 + 30 Genesis Crystals", 79000], ["980 + 110 Genesis Crystals", 249000, "Populer"], ["1980 + 260 Genesis Crystals", 479000], ["3280 + 600 Genesis Crystals", 799000], ["6480 + 1600 Genesis Crystals", 1599000], ["Blessing of the Welkin Moon", 79000, "Hemat"]]),
  },
  {
    id: "valorant", kind: "game", name: "Valorant", short: "Valorant", aliases: ["valo", "vp"],
    category: "FPS", currency: "Valorant Points", popular: true, rank: 5,
    stepTitle: "Data Akun", icon: "fa-gem",
    fields: [{ id: "riotId", label: "Riot ID", ph: "NamaKamu#TAG", maxlength: 24, rule: { type: "regex", re: /^.{3,16}#[A-Za-z0-9]{3,5}$/, msg: "Format Riot ID: Nama#TAG (contoh: Jett#123)." }, hint: "Format: Nama#TAG" }],
    products: rows("valorant", [["475 VP", 59000], ["1000 VP", 119000, "Populer"], ["2050 VP", 239000], ["3650 VP", 419000], ["5350 VP", 599000], ["11000 VP", 1190000]]),
  },
  {
    id: "hok", kind: "game", name: "Honor of Kings", short: "Honor of Kings", aliases: ["hok"],
    category: "MOBA", currency: "Tokens", popular: true, rank: 6,
    stepTitle: "Data Akun", icon: "fa-gem",
    fields: [{ id: "userId", label: "User ID", ph: "Contoh: 12345678", inputmode: "numeric", maxlength: 12, rule: { type: "digits", min: 8, max: 12 }, hint: "Ada di menu profil." }],
    products: rows("hok", [["16 Tokens", 3000], ["80 Tokens", 15000], ["240 Tokens", 45000, "Populer"], ["400 Tokens", 75000], ["800 Tokens", 149000], ["1200 Tokens", 220000]]),
  },
  {
    id: "roblox", kind: "game", name: "Roblox", short: "Roblox", aliases: ["rbx", "robux"],
    category: "Sandbox", currency: "Robux", popular: true, rank: 7,
    stepTitle: "Data Akun", icon: "fa-gem",
    fields: [{ id: "username", label: "Username Roblox", ph: "username_kamu", maxlength: 20, rule: { type: "regex", re: /^[A-Za-z0-9_]{3,20}$/, msg: "Username 3–20 karakter: huruf, angka, atau underscore." }, hint: "3–20 karakter." }],
    products: rows("roblox", [["80 Robux", 15000], ["400 Robux", 75000, "Populer"], ["800 Robux", 150000], ["1700 Robux", 300000], ["4500 Robux", 750000]]),
  },
  {
    id: "codm", kind: "game", name: "Call of Duty Mobile", short: "CoD Mobile", aliases: ["cod", "codm"],
    category: "FPS", currency: "CP", popular: false, rank: 8,
    stepTitle: "Data Akun", icon: "fa-gem",
    fields: [{ id: "openId", label: "Open ID", ph: "Contoh: 6789012345678", inputmode: "numeric", maxlength: 20, rule: { type: "digits", min: 8, max: 20 }, hint: "Ada di menu pengaturan akun." }],
    products: rows("codm", [["63 CP", 10000], ["128 CP", 20000], ["321 CP", 49000, "Populer"], ["645 CP", 98000], ["1373 CP", 199000], ["2750 CP", 395000]]),
  },
];

export const GAMES: Service[] = GAMES_BASE.map((g) => ({
  ...g,
  cover: g.cover ?? `/assets/images/games/${g.id}.svg`,
  subtitle: `${g.category} · ${g.currency}`,
}));

const pulsaPrice = (n: number) => n + (n <= 10000 ? 1000 : 1500);

const PPOB_BASE: Omit<Service, "subtitle">[] = [
  { id: "pulsa", kind: "ppob", name: "Pulsa Semua Operator", short: "Pulsa", icon: "fa-mobile-screen-button", tone: "blue", desc: "Isi ulang pulsa semua operator, proses cepat.", stepTitle: "Nomor Tujuan", fields: [{ ...FIELD_PHONE }], rank: 1,
    products: rows("pulsa", [5000, 10000, 15000, 20000, 25000, 50000, 100000].map((n) => [`Pulsa ${nominal(n)}`, pulsaPrice(n), n === 50000 ? "Populer" : undefined])) },
  { id: "data", kind: "ppob", name: "Paket Data Internet", short: "Paket Data", icon: "fa-wifi", tone: "cyan", desc: "Kuota harian hingga bulanan, semua operator.", stepTitle: "Nomor Tujuan", fields: [{ ...FIELD_PHONE }], rank: 2,
    products: rows("data", [["1,5 GB · 7 hari", 15000], ["3 GB · 30 hari", 28000], ["8 GB · 30 hari", 45000, "Populer"], ["15 GB · 30 hari", 65000], ["30 GB · 30 hari", 95000], ["70 GB · 30 hari", 150000]]) },
  { id: "pln", kind: "ppob", name: "Token Listrik PLN", short: "Token PLN", icon: "fa-bolt", tone: "orange", desc: "Beli token prabayar, kode token langsung tampil.", stepTitle: "Nomor Meter", fields: [{ id: "meter", label: "Nomor Meter / ID Pelanggan", ph: "12345678901", inputmode: "numeric", maxlength: 12, rule: { type: "digits", min: 11, max: 12 }, hint: "11–12 digit, ada di meteran." }], rank: 3,
    products: rows("pln", [20000, 50000, 100000, 200000, 500000, 1000000].map((n) => [`Token ${nominal(n)}`, n + 2500, n === 100000 ? "Populer" : undefined])) },
  { id: "listrik", kind: "ppob", name: "Tagihan Listrik Pascabayar", short: "Tagihan Listrik", icon: "fa-plug-circle-bolt", tone: "purple", desc: "Cek dan bayar tagihan listrik bulanan.", stepTitle: "Data Pelanggan", inquiry: true, billLabel: "Tagihan Listrik", rank: 4,
    fields: [{ id: "custId", label: "ID Pelanggan", ph: "123456789012", inputmode: "numeric", maxlength: 12, rule: { type: "digits", min: 12, max: 12 }, hint: "12 digit ID pelanggan." }] },
  { id: "bpjs", kind: "ppob", name: "BPJS Kesehatan", short: "BPJS", icon: "fa-heart-pulse", tone: "green", desc: "Bayar iuran BPJS Kesehatan keluarga.", stepTitle: "Data Peserta", inquiry: true, billLabel: "Iuran BPJS", rank: 5,
    fields: [{ id: "custId", label: "Nomor Virtual Account", ph: "8888801234567890", inputmode: "numeric", maxlength: 16, rule: { type: "digits", min: 11, max: 16 }, hint: "11–16 digit nomor VA keluarga." }] },
  { id: "pdam", kind: "ppob", name: "PDAM", short: "PDAM", icon: "fa-droplet", tone: "cyan", desc: "Tagihan air PDAM dari berbagai wilayah.", stepTitle: "Data Pelanggan", inquiry: true, billLabel: "Tagihan Air", rank: 6,
    fields: [
      { id: "region", label: "Wilayah PDAM", type: "select", options: ["Jabodetabek", "Jawa Barat", "Jawa Tengah & DIY", "Jawa Timur", "Luar Jawa"] },
      { id: "custId", label: "Nomor Pelanggan", ph: "1234567", inputmode: "numeric", maxlength: 12, rule: { type: "digits", min: 6, max: 12 }, hint: "6–12 digit." },
    ] },
  { id: "internet", kind: "ppob", name: "Internet & TV Kabel", short: "Internet & TV", icon: "fa-tv", tone: "pink", desc: "Tagihan internet rumah dan TV berlangganan.", stepTitle: "Data Pelanggan", inquiry: true, billLabel: "Tagihan Internet & TV", rank: 7,
    fields: [
      { id: "plan", label: "Jenis Layanan", type: "select", options: ["Internet Fiber Rumah", "TV Kabel & Streaming", "Paket Internet + TV"] },
      { id: "custId", label: "Nomor Pelanggan", ph: "12345678", inputmode: "numeric", maxlength: 14, rule: { type: "digits", min: 8, max: 14 }, hint: "8–14 digit." },
    ] },
  { id: "ewallet", kind: "ppob", name: "Saldo E-Wallet", short: "E-Wallet", icon: "fa-wallet", tone: "blue", desc: "Top up DANA, OVO, GoPay, dan ShopeePay.", stepTitle: "Data E-Wallet", layout: "even", rank: 8,
    fields: [{ id: "wallet", label: "E-Wallet", type: "select", options: ["DANA", "OVO", "GoPay", "ShopeePay"] }, { ...FIELD_PHONE, label: "Nomor Terdaftar", detect: false }],
    products: rows("ewallet", [10000, 20000, 50000, 100000, 200000, 500000].map((n) => [`Saldo ${nominal(n)}`, n + 1500, n === 100000 ? "Populer" : undefined])) },
  { id: "voucher", kind: "ppob", name: "Voucher Digital", short: "Voucher Digital", icon: "fa-ticket", tone: "purple", desc: "Voucher aplikasi, streaming, dan belanja.", stepTitle: "Data Penerima", layout: "even", rank: 9,
    fields: [{ id: "brand", label: "Jenis Voucher", type: "select", options: ["Voucher Google Play", "Voucher Spotify", "Voucher Streaming Video"] }, { id: "email", label: "Email Penerima", ph: "nama@email.com", type: "email", inputmode: "email", maxlength: 60, rule: { type: "email" }, hint: "Kode dikirim ke email ini (versi produksi)." }],
    products: rows("voucher", [20000, 50000, 100000, 150000, 300000].map((n) => [`Voucher ${nominal(n)}`, n + 2000, n === 50000 ? "Populer" : undefined])) },
];

export const PPOB: Service[] = PPOB_BASE.map((s) => ({ ...s, subtitle: s.desc ?? "" }));

export const PAYMENTS: Payment[] = [
  { id: "qris", name: "QRIS", desc: "Semua e-wallet & mobile banking", code: "QR", color: "#14241d", fee: { type: "percent", value: 0.7 } },
  { id: "dana", name: "DANA", desc: "Bayar lewat aplikasi DANA", code: "DANA", color: "#118eea", fee: { type: "percent", value: 1 } },
  { id: "ovo", name: "OVO", desc: "Bayar lewat aplikasi OVO", code: "OVO", color: "#4c2a86", fee: { type: "percent", value: 1.5 } },
  { id: "gopay", name: "GoPay", desc: "Bayar lewat aplikasi Gojek", code: "GP", color: "#00a05a", fee: { type: "percent", value: 1 } },
  { id: "shopeepay", name: "ShopeePay", desc: "Bayar lewat aplikasi Shopee", code: "SP", color: "#e8472b", fee: { type: "percent", value: 1.2 } },
  { id: "va", name: "Virtual Account", desc: "Bank besar di Indonesia", code: "VA", color: "#0e7a57", fee: { type: "flat", value: 4000 } },
  { id: "bank", name: "Transfer Bank", desc: "Transfer manual, verifikasi otomatis", code: "TF", color: "#475569", fee: { type: "flat", value: 2500 } },
];

export const PROMOS: Promo[] = [
  { code: "HEMAT10", title: "Diskon 10%", desc: "Maks. Rp15.000 · min. belanja Rp30.000", type: "percent", value: 10, max: 15000, min: 30000, scope: "all" },
  { code: "GAMER5K", title: "Potongan Rp5.000", desc: "Khusus top up game · min. belanja Rp25.000", type: "flat", value: 5000, min: 25000, scope: "game" },
  { code: "PPOBHEMAT", title: "Potongan Rp2.000", desc: "Khusus layanan PPOB · min. belanja Rp20.000", type: "flat", value: 2000, min: 20000, scope: "ppob" },
  { code: "NEWUSER", title: "Diskon 15% Transaksi Pertama", desc: "Maks. Rp25.000 · min. belanja Rp50.000", type: "percent", value: 15, max: 25000, min: 50000, scope: "all", firstOnly: true },
];

export const PROMO_SLIDES: PromoSlide[] = [
  { code: "NEWUSER", icon: "fa-gift", title: "Diskon 15% Transaksi Pertama", text: "Untuk pengguna baru di perangkat ini. Maks. Rp25.000." },
  { code: "HEMAT10", icon: "fa-percent", title: "Hemat 10% Semua Produk", text: "Berlaku untuk game & PPOB. Min. belanja Rp30.000." },
  { code: "GAMER5K", icon: "fa-gamepad", title: "Potongan Rp5.000 Top Up Game", text: "Khusus top up game favoritmu. Min. belanja Rp25.000." },
  { code: "PPOBHEMAT", icon: "fa-bolt", title: "Potongan Rp2.000 PPOB", text: "Untuk pulsa, data, token, dan tagihan. Min. Rp20.000." },
];

export const BEST: [ServiceKind, string, string][] = [
  ["game", "mlbb", "mlbb-5"], ["game", "freefire", "freefire-4"], ["game", "pubgm", "pubgm-3"], ["ppob", "pulsa", "pulsa-6"],
  ["ppob", "pln", "pln-3"], ["game", "genshin", "genshin-3"], ["ppob", "ewallet", "ewallet-4"], ["game", "valorant", "valorant-2"],
];

export const DEALS: [ServiceKind, string, string, string][] = [
  ["game", "mlbb", "mlbb-9", "HEMAT10"], ["game", "genshin", "genshin-7", "HEMAT10"], ["ppob", "data", "data-3", "PPOBHEMAT"],
  ["game", "codm", "codm-4", "GAMER5K"], ["game", "roblox", "roblox-2", "GAMER5K"], ["ppob", "pln", "pln-4", "PPOBHEMAT"],
];


export const FAQS: [string, string][] = [
  ["Bagaimana cara top up game?", "Pilih game, isi User ID (dan Zone/Server bila ada), pilih nominal, pasang kode promo bila punya, pilih metode pembayaran, lalu tekan “Lanjutkan Pembayaran”."],
  ["Di mana saya menemukan User ID dan Zone ID?", "Biasanya ada di halaman profil dalam game. Petunjuk singkat tampil di bawah setiap kolom input pada form top up."],
  ["Bagaimana cara memakai kode promo?", "Klik “Pakai Kode” pada banner promo, atau ketik kodenya di langkah Promo saat checkout. Syarat minimal belanja dan cakupan produk ditampilkan otomatis."],
  ["Bagaimana cara mengecek status pesanan?", "Buka Cek Transaksi, masukkan nomor invoice (contoh: INV-240101-AB12C), atau pilih dari riwayat transaksi di perangkat ini."],
  ["Apa saja metode pembayaran yang tersedia?", "Tersedia berbagai metode pembayaran seperti QRIS, e-wallet, virtual account, dan transfer bank."],
];

export const LEGAL: Record<string, { title: string; icon: string; body: [string, string][] }> = {
  terms: {
    title: "Syarat & Ketentuan", icon: "fa-file-contract",
    body: [
      ["Penggunaan layanan", "Pengguna wajib memasukkan data akun/tujuan dengan benar. Kesalahan input dapat membuat pesanan tidak dapat dibatalkan."],
      ["Harga & promo", "Harga, biaya admin, dan promo dapat berubah sewaktu-waktu."],
      ["Pengembalian dana", "Kebijakan refund akan ditentukan oleh operator platform dan penyedia pembayaran."],
    ],
  },
  privacy: {
    title: "Kebijakan Privasi", icon: "fa-user-shield",
    body: [
      ["Data yang disimpan", "Hanya riwayat transaksi dan nama pengguna yang disimpan di browser Anda. Kata sandi tidak disimpan."],
      ["Menghapus data", "Anda dapat menghapus riwayat lewat tombol “Hapus” di halaman Cek Transaksi atau dengan membersihkan data situs di browser."],
    ],
  },
  contact: {
    title: "Kontak", icon: "fa-address-book",
    body: [
      ["Email", "support@example.com"],
      ["WhatsApp", "+62 800-0000-0000"],
      ["Jam layanan", "Setiap hari, 08.00–22.00 WIB"],
    ],
  },
};

export const OPERATORS: [string, RegExp][] = [
  ["Telkomsel", /^08(11|12|13|21|22|23|51|52|53)/],
  ["Indosat", /^08(14|15|16|55|56|57|58)/],
  ["XL", /^08(17|18|19|59|77|78)/],
  ["Axis", /^08(31|32|33|38)/],
  ["Tri", /^089[5-9]/],
  ["Smartfren", /^088[1-9]/],
];

export const STATUS = {
  pending: { label: "Menunggu Pembayaran", icon: "fa-clock", desc: "Selesaikan pembayaran agar pesanan dapat diproses." },
  processing: { label: "Diproses", icon: "fa-gear", desc: "Pembayaran diterima. Pesanan sedang diproses." },
  success: { label: "Berhasil", icon: "fa-circle-check", desc: "Pesanan selesai diproses." },
  failed: { label: "Gagal", icon: "fa-circle-xmark", desc: "Pesanan tidak dapat diselesaikan." },
  cancelled: { label: "Dibatalkan", icon: "fa-ban", desc: "Pesanan dibatalkan dan tidak akan diproses." },
} as const;

export function getService(kind: ServiceKind, id: string): Service | null {
  return (kind === "game" ? GAMES : PPOB).find((s) => s.id === id) ?? null;
}

export function getProduct(kind: ServiceKind, svcId: string, pid: string) {
  return getService(kind, svcId)?.products?.find((p) => p.id === pid) ?? null;
}

export function findPayment(id: string | null | undefined): Payment | null {
  return PAYMENTS.find((p) => p.id === id) ?? null;
}

export function minPrice(g: Service) {
  return Math.min(...(g.products ?? []).map((p) => p.price));
}

export const idr = (n: number) => (n < 0 ? "-" : "") + "Rp" + Math.abs(Math.round(n)).toLocaleString("id-ID");

export const feeText = (pay: Payment) =>
  pay.fee.type === "percent" ? `Biaya ${String(pay.fee.value).replace(".", ",")}%` : `Biaya ${idr(pay.fee.value)}`;

export const fmtDate = (ts: number) =>
  new Intl.DateTimeFormat(CONFIG.locale, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(ts);

export const mask = (v: string) => {
  const s = String(v);
  if (s.includes("@")) {
    const [u = "", d = ""] = s.split("@");
    return `${u[0] || ""}•••@${d}`;
  }
  return s.length <= 4 ? s : s.slice(0, 2) + "•".repeat(Math.min(s.length - 4, 6)) + s.slice(-2);
};

export const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const debounce = <A extends unknown[]>(fn: (...args: A) => void, ms = 150) => {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, reduceMotion() ? Math.min(ms, 40) : ms));

const randomCode = (n: number) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const buf = new Uint32Array(n);
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) window.crypto.getRandomValues(buf);
  else for (let i = 0; i < n; i++) buf[i] = Math.floor(Math.random() * 4e9);
  return [...buf].map((x) => chars[x % chars.length]).join("");
};

export const newInvoiceId = () => {
  const d = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `INV-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${randomCode(5)}`;
};

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* fallback below */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0;top:0";
    document.body.appendChild(ta);
    ta.select();
    const okCopy = document.execCommand("copy");
    ta.remove();
    return okCopy;
  } catch {
    return false;
  }
}

export const ESCAPED = (s: unknown) => String(s ?? "");
