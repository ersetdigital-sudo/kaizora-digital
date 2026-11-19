import type { Service } from "@/types";

const rows = (prefix: string, list: [string, number, string?][]) =>
  list.map(([label, price, tag], i) => ({ id: `${prefix}-${i + 1}`, label, price, tag }));

const nominal = (n: number) => "Rp" + n.toLocaleString("id-ID");
const pulsaPrice = (n: number) => n + (n <= 10000 ? 1000 : 1500);

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

export function getPpob(id: string): Service | null {
  return PPOB.find((s) => s.id === id) ?? null;
}

export function getPpobProduct(svcId: string, pid: string) {
  return getPpob(svcId)?.products?.find((p) => p.id === pid) ?? null;
}
