import { findPayment, idr, PROMOS } from "./data";
import type { Payment, PriceBreakdown, Promo, PromoState, ServiceKind } from "./types";

function roundDiscount(amount: number): number {
  return amount;
}

export const Promos = {
  find(code: string): Promo | undefined {
    return PROMOS.find((p) => p.code === code);
  },
  evaluate(
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
        reason: `Minimal belanja ${idr(promo.min)} untuk memakai kode ${promo.code}.`,
      };
    }
    let amount = promo.type === "percent" ? Math.floor((ctx.subtotal * promo.value) / 100) : promo.value;
    if (promo.max) amount = Math.min(amount, promo.max);
    amount = roundDiscount(amount);
    return { ok: true, amount: Math.max(0, Math.min(amount, ctx.subtotal)) };
  },
};

export const Pricing = {
  fee(pay: Payment | null, base: number): number {
    if (!pay || base <= 0) return 0;
    return pay.fee.type === "percent"
      ? Math.ceil(+((base * pay.fee.value) / 100).toFixed(4))
      : pay.fee.value;
  },
  compute({
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
    const state = promo ? Promos.evaluate(promo, { kind, subtotal, isFirst }) : null;
    const discount = state && state.ok ? state.amount : 0;
    const fee = Pricing.fee(findPayment(payId ?? null), subtotal - discount);
    return { subtotal, discount, fee, total: Math.max(0, subtotal - discount + fee), promoState: state };
  },
};
