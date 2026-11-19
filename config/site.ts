export const siteConfig = {
  name: "KAIZORA DIGITAL",
  shortName: "KAIZORA DIGITAL",
  description:
    "Marketplace digital untuk top up game, pulsa, paket data, token PLN, e-wallet, dan tagihan dalam satu platform.",
  locale: "id-ID",
  url: "https://kaizora-digital.example.com",
  themeColor: "#14241d",
  storageKeys: {
    tx: "kaizora.tx.v1",
    user: "kaizora.user.v1",
  },
  payment: {
    qrisImage: "/assets/images/payments/Qris.jpeg",
    qrisTimerSeconds: 15 * 60,
  },
  contact: {
    email: "support@example.com",
    whatsapp: "+62 800-0000-0000",
    hours: "Setiap hari, 08.00–22.00 WIB",
  },
} as const;

export type SiteConfig = typeof siteConfig;
