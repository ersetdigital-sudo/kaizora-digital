"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import { getService, getProduct } from "@/lib/data/catalog";
import { PAYMENTS, getPayment, feeText } from "@/lib/data/payments";
import { PROMOS } from "@/lib/data/promos";
import { OPERATORS } from "@/lib/data/content";
import { computePrice, evaluatePromo } from "@/lib/pricing";
import { idr } from "@/lib/utils";
import { api, TxStore } from "@/lib/store";
import type { OrderPayload, ServiceField } from "@/types";
import { useUI } from "../ui/UIProvider";
import type { OrderTarget } from "../ui/ui-context";
import { initState, validateField, type OrderState, type PromoMsg } from "./order-helpers";

export default function OrderModal({ target, onClose }: { target: OrderTarget | null; onClose: () => void }) {
  const { toast, consumePromo, openInvoice } = useUI();
  const svc = target ? getService(target.kind, target.id) : null;
  const [state, setState] = useState<OrderState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productError, setProductError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [promoMsg, setPromoMsg] = useState<PromoMsg>(null);
  const [promoInput, setPromoInput] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    if (!target || !svc) { setState(null); return; }
    const initial = initState(svc, target);
    setState(initial);
    setErrors({}); setProductError(""); setPaymentError(""); setPromoMsg(null); setPromoInput("");
    setConfirmOpen(false); setInquiryLoading(false); setCreating(false);
    setIsFirst(TxStore.localCount() === 0);
    const code = target.promo ?? consumePromo();
    if (code) window.setTimeout(() => applyPromo(code, initial), 0);
    if (target.productId) {
      const label = getProduct(target.kind, target.id, target.productId)?.label ?? "Produk";
      toast({ msg: `${label} dipilih. Lengkapi data untuk melanjutkan.`, type: "info", duration: 3000 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.kind, target?.id, target?.productId, target?.promo]);

  const promo = useMemo(() => (state?.promoCode ? PROMOS.find((p) => p.code === state.promoCode) ?? null : null), [state?.promoCode]);
  const pricing = useMemo(() => {
    if (!svc || !state) return null;
    const p = state.products.find((x) => x.id === state.productId) ?? null;
    return { p, ...computePrice({ subtotal: p ? p.price : 0, promo, kind: svc.kind, payId: state.payId, isFirst }) };
  }, [svc, state, promo, isFirst]);

  function patch(fn: (s: OrderState) => OrderState) { setState((s) => (s ? fn(s) : s)); }

  function applyPromo(raw: string, base?: OrderState) {
    const code = String(raw || "").trim().toUpperCase();
    if (!svc) return;
    if (!code) { setPromoMsg({ text: "Masukkan kode promo terlebih dahulu.", tone: "err" }); return; }
    const found = PROMOS.find((p) => p.code === code);
    const cur = base ?? state;
    if (!found) {
      patch((s) => ({ ...s, promoCode: null }));
      setPromoMsg({ text: `Kode “${code}” tidak ditemukan.`, tone: "err" }); setPromoInput(code); return;
    }
    const sub = cur?.products.find((x) => x.id === cur?.productId)?.price ?? 0;
    const sres = evaluatePromo(found, { kind: svc.kind, subtotal: sub, isFirst });
    if (!sres.ok && sres.hard) {
      patch((s) => ({ ...s, promoCode: null }));
      setPromoMsg({ text: sres.reason, tone: "err" }); setPromoInput(code); return;
    }
    patch((s) => ({ ...s, promoCode: found.code })); setPromoInput(code);
    setPromoMsg(sres.ok ? { text: `Kode ${found.code} dipakai — hemat ${idr(sres.amount)}.`, tone: "ok" } : { text: sres.reason, tone: "warn" });
    if (sres.ok) toast({ msg: `Kode ${code} berhasil dipakai.`, type: "success" });
  }

  if (!target || !svc || !state || !pricing) return null;

  const onFieldChange = (f: ServiceField, value: string) => {
    let v = value;
    if (f.type !== "select" && f.rule && (f.rule.type === "digits" || f.rule.type === "phone")) v = v.replace(/\D/g, "");
    patch((s) => {
      const next = { ...s, values: { ...s.values, [f.id]: v } };
      if (f.id === "custId" && s.bill) { next.bill = null; next.products = []; next.productId = null; }
      return next;
    });
    if (state.touched[f.id]) setErrors((e) => ({ ...e, [f.id]: validateField(f, v) }));
  };
  const onFieldBlur = (f: ServiceField, value: string) => {
    patch((s) => ({ ...s, touched: { ...s.touched, [f.id]: true } }));
    setErrors((e) => ({ ...e, [f.id]: validateField(f, value) }));
  };

  const runInquiry = async () => {
    const f = svc.fields.find((x) => x.id === "custId"); if (!f) return;
    const msg = validateField(f, state.values.custId ?? "");
    setErrors((e) => ({ ...e, custId: msg })); if (msg) return;
    setInquiryLoading(true);
    try {
      const bill = await api.inquireBill(svc, state.values.custId ?? "");
      patch((s) => ({ ...s, bill, products: [{ id: "bill", label: bill.label, price: bill.price, tag: "Tagihan" }], productId: "bill" }));
      setProductError("");
    } finally { setInquiryLoading(false); }
  };

  const validateAll = (): boolean => {
    const nextErrors: Record<string, string> = {};
    svc.fields.forEach((f) => { nextErrors[f.id] = validateField(f, state.values[f.id] ?? ""); });
    setErrors(nextErrors);
    const hasFieldError = Object.values(nextErrors).some(Boolean);
    const noProduct = !state.productId; const noPayment = !state.payId;
    setProductError(noProduct ? (svc.inquiry ? "Cek tagihan terlebih dahulu." : "Pilih nominal terlebih dahulu.") : "");
    setPaymentError(noPayment ? "Pilih metode pembayaran." : "");
    return !hasFieldError && !noProduct && !noPayment;
  };

  const payload = (): OrderPayload | null => {
    if (!pricing.p) return null;
    const pay = getPayment(state.payId); if (!pay) return null;
    return { kind: svc.kind, serviceId: svc.id, serviceName: svc.name, productLabel: pricing.p.label,
      fields: svc.fields.map((f) => ({ label: f.label, value: state.values[f.id] ?? "", secret: f.type !== "select" })),
      subtotal: pricing.subtotal, discount: pricing.discount, promoCode: pricing.discount && promo ? promo.code : null,
      fee: pricing.fee, total: pricing.total, paymentId: pay.id, paymentName: pay.name };
  };

  const submitOrder = async () => {
    const p = payload(); if (!p) return;
    setCreating(true);
    try {
      const tx = await api.createOrder(p);
      setConfirmOpen(false); onClose(); openInvoice(tx.id);
      toast({ msg: "Invoice berhasil dibuat.", type: "success" });
    } catch { toast({ msg: "Gagal membuat invoice. Coba lagi.", type: "error" }); }
    finally { setCreating(false); }
  };

  const targetText = svc.fields.map((f) => state.values[f.id]).filter(Boolean).map((v, i) => (i === 1 && svc.id === "mlbb" ? `(${v})` : v)).join(" ") || "–";
  const operator = OPERATORS.find(([, re]) => re.test(state.values.phone ?? ""))?.[0];
  const orderHead = (<>{svc.kind === "game" ? <img src={svc.cover!} width={40} height={50} alt="" /> : <span className={`modal__ico tone-${svc.tone}`}><Icon name={svc.icon} /></span>}<h2 id="orderTitle">{svc.name}<small>{svc.subtitle}</small></h2></>);

  return (
    <>
      <Modal id="orderModal" title={orderHead} onClose={onClose} size="lg" labeledBy="orderTitle" footClassName="order-bar" footId="orderBar"
        footer={<><div className="order-bar__total"><small>Total bayar</small><strong id="barTotal">{idr(pricing.total)}</strong></div><button className="btn btn--primary" type="button" onClick={() => { if (validateAll()) setConfirmOpen(true); else toast({ msg: "Periksa kembali data pesananmu.", type: "error" }); }}>Lanjutkan Pembayaran</button></>}>
        <div className="order">
          <form id="orderForm" className="order__form" noValidate autoComplete="off" onSubmit={(e) => { e.preventDefault(); if (validateAll()) setConfirmOpen(true); else toast({ msg: "Periksa kembali data pesananmu.", type: "error" }); }}>
            <fieldset className="step-box">
              <legend><span className="step-num">1</span> {svc.stepTitle}</legend>
              <div className={svc.layout ? `field-row field-row--${svc.layout === "split" ? "2" : "even"}` : undefined}>
                {svc.fields.map((f) => {
                  const fid = `f-${f.id}`; const err = errors[f.id] ?? "";
                  const control = f.type === "select" ? (
                    <select className="input" id={fid} required value={state.values[f.id] ?? ""} onChange={(e) => onFieldChange(f, e.target.value)} onBlur={(e) => onFieldBlur(f, e.target.value)} aria-invalid={err ? true : false}>
                      <option value="">Pilih {f.label.toLowerCase()}</option>{(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input className={`input${err ? "" : state.values[f.id]?.trim() ? " is-valid" : ""}`} id={fid} type={f.type === "email" ? "email" : "text"}
                      inputMode={f.inputmode as React.HTMLAttributes<HTMLInputElement>["inputMode"]} placeholder={f.ph} maxLength={f.maxlength ?? 40}
                      autoComplete="off" autoCapitalize="off" spellCheck={false} required value={state.values[f.id] ?? ""}
                      onChange={(e) => onFieldChange(f, e.target.value)} onBlur={(e) => onFieldBlur(f, e.target.value)} aria-invalid={err ? true : false} />
                  );
                  const inquiryBtn = svc.inquiry && f.id === "custId" ? <button className={`btn btn--outline${inquiryLoading ? " is-loading" : ""}`} type="button" onClick={runInquiry} disabled={inquiryLoading}>Cek Tagihan</button> : null;
                  return (
                    <div className="field" key={f.id}>
                      <label htmlFor={fid}>{f.label}</label>
                      {inquiryBtn ? <div className="input-group">{control}{inquiryBtn}</div> : control}
                      {f.id === "phone" && operator ? <p className="field__hint"><span className="op-chip"><Icon name="fa-signal" /> {operator}</span></p> : <p className="field__hint">{f.hint}</p>}
                      <p className="field__error" role="alert">{err}</p>
                    </div>
                  );
                })}
              </div>
              {svc.kind === "game" && <p className="field__hint"><Icon name="fa-circle-info" /> Verifikasi nickname otomatis akan aktif setelah terhubung ke API provider.</p>}
              {state.bill && (<div className="bill" role="status"><b><Icon name="fa-circle-check" /> Tagihan ditemukan</b><dl>
                <div><dt>Nama pelanggan</dt><dd>{state.bill.name}</dd></div><div><dt>Periode</dt><dd>{state.bill.period}</dd></div>
                <div><dt>Tagihan</dt><dd>{idr(state.bill.amount)}</dd></div><div><dt>Biaya layanan</dt><dd>{idr(state.bill.admin)}</dd></div>
              </dl></div>)}
            </fieldset>
            <fieldset className="step-box">
              <legend><span className="step-num">2</span> {svc.inquiry ? "Tagihan" : svc.kind === "game" ? `Pilih Nominal ${svc.currency}` : "Pilih Nominal"}</legend>
              {svc.inquiry && state.products.length === 0 ? <p className="field__hint"><Icon name="fa-circle-info" /> Masukkan nomor pelanggan lalu tekan “Cek Tagihan” untuk menampilkan jumlah yang harus dibayar.</p> : (
                <div className="opt-grid">{state.products.map((p) => (
                  <label className="opt" key={p.id}><input className="opt__input" type="radio" name="product" value={p.id} checked={state.productId === p.id} onChange={() => { patch((s) => ({ ...s, productId: p.id })); setProductError(""); }} />
                    <span className="opt__card">{p.tag ? <span className="opt__tag">{p.tag}</span> : null}<span className="opt__name">{p.label}</span><span className="opt__price">{idr(p.price)}</span></span>
                  </label>
                ))}</div>
              )}
              <p className="field__error" role="alert">{productError}</p>
            </fieldset>
            <fieldset className="step-box">
              <legend><span className="step-num">3</span> Kode Promo</legend>
              <div className="promo-row">
                <label className="sr-only" htmlFor="promoInput">Kode promo</label>
                <input className="input" id="promoInput" type="text" placeholder="Masukkan kode" maxLength={16} autoComplete="off" spellCheck={false}
                  value={promoInput} onChange={(e) => setPromoInput(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyPromo(promoInput); } }} />
                <button className="btn btn--outline" type="button" onClick={() => applyPromo(promoInput)}>Terapkan</button>
              </div>
              <p className={`promo-msg${promoMsg ? ` is-${promoMsg.tone}` : ""}`} role="status" aria-live="polite">{promoMsg && (<><Icon name={promoMsg.tone === "ok" ? "fa-circle-check" : promoMsg.tone === "err" ? "fa-circle-exclamation" : "fa-circle-info"} /><span>{promoMsg.text}{state.promoCode && <> <button type="button" style={{ textDecoration: "underline", fontWeight: 700 }} onClick={() => { patch((s) => ({ ...s, promoCode: null })); setPromoInput(""); setPromoMsg({ text: "Kode promo dihapus.", tone: "warn" }); }}>Hapus</button></>}</span></>)}</p>
              <div className="promo-suggest" aria-label="Contoh kode promo">{PROMOS.map((p) => <button className="chip" type="button" key={p.code} title={p.desc} onClick={() => applyPromo(p.code)}>{p.code}</button>)}</div>
            </fieldset>
            <fieldset className="step-box">
              <legend><span className="step-num">4</span> Metode Pembayaran</legend>
              <div className="pay-list">{PAYMENTS.map((p) => (
                <label className="opt pay" key={p.id}><input className="opt__input" type="radio" name="payment" value={p.id} checked={state.payId === p.id} onChange={() => { patch((s) => ({ ...s, payId: p.id })); setPaymentError(""); }} />
                  <span className="opt__card"><span className="pay-logo" style={{ "--pc": p.color } as CSSProperties}>{p.code}</span><span className="opt__name">{p.name}<small>{p.desc} · {feeText(p)}</small></span></span>
                </label>
              ))}</div>
              <p className="field__error" role="alert">{paymentError}</p>
            </fieldset>
          </form>
          <aside className="summary" aria-label="Ringkasan transaksi">
            <h3><Icon name="fa-receipt" style={{ color: "var(--brand)" }} /> Ringkasan Transaksi</h3>
            <div className="summary__svc">{svc.kind === "game" ? <img src={svc.cover!} width={36} height={45} alt="" /> : <span className={`modal__ico tone-${svc.tone}`} style={{ width: 36, height: 36, fontSize: "1rem" }}><Icon name={svc.icon} /></span>}<span>{svc.name}</span></div>
            <dl className="kv">
              <div><dt>Tujuan</dt><dd>{targetText}</dd></div>
              <div><dt>Produk</dt><dd>{pricing.p ? pricing.p.label : "Belum dipilih"}</dd></div>
              <div><dt>Harga</dt><dd>{idr(pricing.subtotal)}</dd></div>
              {pricing.discount > 0 && <div className="is-discount"><dt>Diskon {promo ? `(${promo.code})` : ""}</dt><dd>{idr(-pricing.discount)}</dd></div>}
              <div><dt>Biaya admin</dt><dd>{state.payId ? idr(pricing.fee) : "—"}</dd></div>
              <div><dt>Pembayaran</dt><dd>{getPayment(state.payId)?.name ?? "Belum dipilih"}</dd></div>
            </dl>
            <div className="summary__total"><span>Total Bayar</span><strong id="sumTotal">{idr(pricing.total)}</strong></div>
            <button className="btn btn--primary btn--block summary__submit" type="button" onClick={() => { if (validateAll()) setConfirmOpen(true); else toast({ msg: "Periksa kembali data pesananmu.", type: "error" }); }}>Lanjutkan Pembayaran <Icon name="fa-arrow-right" /></button>
            <p className="summary__note"><Icon name="fa-shield-halved" /><span>Periksa kembali rincian pesanan sebelum melanjutkan.</span></p>
          </aside>
        </div>
      </Modal>
      {confirmOpen && (
        <Modal id="confirmModal" title={<h2 id="confirmTitle">Konfirmasi Pesanan</h2>} onClose={() => setConfirmOpen(false)} size="sm" labeledBy="confirmTitle"
          footer={<><button className="btn btn--outline" type="button" onClick={() => setConfirmOpen(false)}>Ubah Pesanan</button><button className={`btn btn--primary${creating ? " is-loading" : ""}`} type="button" onClick={submitOrder} disabled={creating}><Icon name="fa-file-invoice" /> Buat Invoice</button></>}>
          <div className="notice"><Icon name="fa-triangle-exclamation" /><span>Periksa data dengan teliti sebelum melanjutkan.</span></div>
          <div className="confirm-list"><dl className="kv">
            <div><dt>Layanan</dt><dd>{svc.name}</dd></div>
            {svc.fields.map((f) => <div key={f.id}><dt>{f.label}</dt><dd>{state.values[f.id]}</dd></div>)}
            <div><dt>Produk</dt><dd>{pricing.p?.label}</dd></div>
            <div><dt>Harga</dt><dd>{idr(pricing.subtotal)}</dd></div>
            {pricing.discount > 0 && <div className="is-discount"><dt>Diskon ({promo?.code})</dt><dd>{idr(-pricing.discount)}</dd></div>}
            <div><dt>Biaya admin</dt><dd>{idr(pricing.fee)}</dd></div>
            <div><dt>Pembayaran</dt><dd>{getPayment(state.payId)?.name}</dd></div>
            <div className="is-total"><dt>Total Bayar</dt><dd>{idr(pricing.total)}</dd></div>
          </dl></div>
        </Modal>
      )}
    </>
  );
}
