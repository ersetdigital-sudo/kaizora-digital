import type { Promo, PromoSlide, ServiceKind } from "@/types";

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

export function findPromo(code: string): Promo | undefined {
  return PROMOS.find((p) => p.code === code);
}
