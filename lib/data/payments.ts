import type { Payment } from "@/types";

export const PAYMENTS: Payment[] = [
  { id: "qris", name: "QRIS", desc: "Semua e-wallet & mobile banking", code: "QR", color: "#14241d", fee: { type: "percent", value: 0.7 } },
  { id: "dana", name: "DANA", desc: "Bayar lewat aplikasi DANA", code: "DANA", color: "#118eea", fee: { type: "percent", value: 1 } },
  { id: "ovo", name: "OVO", desc: "Bayar lewat aplikasi OVO", code: "OVO", color: "#4c2a86", fee: { type: "percent", value: 1.5 } },
  { id: "gopay", name: "GoPay", desc: "Bayar lewat aplikasi Gojek", code: "GP", color: "#00a05a", fee: { type: "percent", value: 1 } },
  { id: "shopeepay", name: "ShopeePay", desc: "Bayar lewat aplikasi Shopee", code: "SP", color: "#e8472b", fee: { type: "percent", value: 1.2 } },
  { id: "va", name: "Virtual Account", desc: "Bank besar di Indonesia", code: "VA", color: "#0e7a57", fee: { type: "flat", value: 4000 } },
  { id: "bank", name: "Transfer Bank", desc: "Transfer manual, verifikasi otomatis", code: "TF", color: "#475569", fee: { type: "flat", value: 2500 } },
];

export function getPayment(id: string | null | undefined): Payment | null {
  return PAYMENTS.find((p) => p.id === id) ?? null;
}

export function feeText(pay: { fee: Payment["fee"] }) {
  if (pay.fee.type === "percent") return `Biaya ${String(pay.fee.value).replace(".", ",")}%`;
  return `Biaya Rp${Math.abs(Math.round(pay.fee.value)).toLocaleString("id-ID")}`;
}
