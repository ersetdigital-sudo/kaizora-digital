import type { Service } from "@/types";

const rows = (prefix: string, list: [string, number, string?][]) =>
  list.map(([label, price, tag], i) => ({ id: `${prefix}-${i + 1}`, label, price, tag }));

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

export function getGame(id: string): Service | null {
  return GAMES.find((g) => g.id === id) ?? null;
}

export function getGameProduct(svcId: string, pid: string) {
  return getGame(svcId)?.products?.find((p) => p.id === pid) ?? null;
}

export function gameMinPrice(g: Service) {
  return Math.min(...(g.products ?? []).map((p) => p.price));
}
