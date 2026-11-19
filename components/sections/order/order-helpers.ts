import { PROMOS } from "@/lib/data/promos";
import { computePrice, evaluatePromo } from "@/lib/pricing";
import type { OrderTarget } from "@/components/sections/ui/ui-context";
import type { Promo, Service, ServiceField } from "@/types";

export interface OrderState {
  values: Record<string, string>;
  touched: Record<string, boolean>;
  products: { id: string; label: string; price: number; tag?: string }[];
  productId: string | null;
  promoCode: string | null;
  payId: string | null;
  bill: { name: string; period: string; amount: number; admin: number; price: number; label: string } | null;
}

export function validateField(f: ServiceField, raw: string): string {
  const v = String(raw ?? "").trim();
  if (!v) return f.type === "select" ? `Pilih ${f.label.toLowerCase()}.` : `${f.label} wajib diisi.`;
  const r = f.rule;
  if (!r) return "";
  if (r.type === "digits") {
    if (!/^\d+$/.test(v)) return `${f.label} hanya boleh berisi angka.`;
    if (v.length < r.min || v.length > r.max) return `${f.label} harus ${r.min === r.max ? r.min : `${r.min}–${r.max}`} digit.`;
  }
  if (r.type === "phone" && !/^08\d{8,12}$/.test(v)) return "Nomor HP diawali 08 dan terdiri dari 10–14 digit.";
  if (r.type === "regex" && !r.re.test(v)) return r.msg;
  if (r.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Format email belum benar.";
  return "";
}

export function initState(svc: Service, target: OrderTarget): OrderState {
  const products = svc.products ? [...svc.products] : [];
  return {
    values: {},
    touched: {},
    products,
    productId: target.productId && products.some((p) => p.id === target.productId) ? target.productId : null,
    promoCode: null,
    payId: null,
    bill: null,
  };
}

export function getPricing(svc: Service, state: OrderState, isFirst: boolean) {
  const p = state.products.find((x) => x.id === state.productId) ?? null;
  const promo = state.promoCode ? PROMOS.find((x) => x.code === state.promoCode) ?? null : null;
  return { p, promo, ...computePrice({ subtotal: p ? p.price : 0, promo, kind: svc.kind, payId: state.payId, isFirst }) };
}

export type PromoMsg = { text: string; tone: "ok" | "err" | "warn" } | null;

export function promoMessage(code: string | null, svc: Service, state: OrderState, isFirst: boolean): PromoMsg {
  if (!code) return null;
  const promo = PROMOS.find((x) => x.code === code);
  if (!promo) return null;
  const sub = state.products.find((x) => x.id === state.productId)?.price ?? 0;
  const s = evaluatePromo(promo, { kind: svc.kind, subtotal: sub, isFirst });
  if (s.ok) return { text: `Kode ${promo.code} dipakai — hemat Rp${s.amount.toLocaleString("id-ID")}.`, tone: "ok" };
  return { text: s.reason, tone: "warn" };
}
