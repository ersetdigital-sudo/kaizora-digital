import { getPayment } from "@/lib/data/payments";
import { PROMOS } from "@/lib/data/promos";
import type { Payment, PriceBreakdown, Promo, PromoState, ServiceKind } from "@/types";

export function evaluatePromo(
  promo: Promo,
  ctx: { kind: ServiceKind; subtotal: number; isFirst: boolean },
): PromoState {
  if (promo.scope !== "all" && promo.scope !== ctx.kind) {
    return {
      ok: false,
      hard: true,
      reason: `Kode ${promo.code} hanya berlaku untuk ${promo.scope === "game" ? "Top Up Game" : "layanan PPOB"}.`,
    };
  }
  if (promo.firstOnly && !ctx.isFirst) {
    return { ok: false, hard: true, reason: `Kode ${promo.code} hanya berlaku untuk transaksi pertama.` };
  }
  if (ctx.subtotal < promo.min) {
    return {
      ok: false,
      hard: false,
      reason: `Minimal belanja Rp${promo.min.toLocaleString("id-ID")} untuk memakai kode ${promo.code}.`,
    };
  }
  let amount = promo.type === "percent" ? Math.floor((ctx.subtotal * promo.value) / 100) : promo.value;
  if (promo.max) amount = Math.min(amount, promo.max);
  return { ok: true, amount: Math.max(0, Math.min(amount, ctx.subtotal)) };
}

export function paymentFee(pay: Payment | null, base: number): number {
  if (!pay || base <= 0) return 0;
  return pay.fee.type === "percent"
    ? Math.ceil(+((base * pay.fee.value) / 100).toFixed(4))
    : pay.fee.value;
}

export function computePrice({
  subtotal,
  promo,
  kind,
  payId,
  isFirst,
}: {
  subtotal: number;
  promo?: Promo | null;
  kind: ServiceKind;
  payId?: string | null;
  isFirst: boolean;
}): PriceBreakdown {
  const promoState = promo ? evaluatePromo(promo, { kind, subtotal, isFirst }) : null;
  const discount = promoState && promoState.ok ? promoState.amount : 0;
  const fee = paymentFee(getPayment(payId ?? null), subtotal - discount);
  return { subtotal, discount, fee, total: Math.max(0, subtotal - discount + fee), promoState };
}

export function findPromoByCode(code: string): Promo | undefined {
  return PROMOS.find((p) => p.code === code);
}
