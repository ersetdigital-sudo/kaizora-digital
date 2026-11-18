import { useCallback, useEffect, useMemo, useState } from "react";
import {
  api,
  findPayment,
  feeText,
  getProduct,
  getService,
  idr,
  OPERATORS,
  Pricing,
  Promos,
  reduceMotion,
  STATUS,
  TxStore,
  wait,
} from "@/lib";
import { PROMOS } from "@/lib/data";
import type { BillInquiry, ServiceField, TxField, OrderPayload, ServiceKind } from "@/lib/types";
import Modal from "./Modal";
import { useUI } from "./UIProvider";
import type { OrderTarget } from "./ui-context";

interface OrderState {
  values: Record<string, string>;
  touched: Record<string, boolean>;
  products: { id: string; label: string; price: number; tag?: string }[];
  productId: string | null;
  promoCode: string | null;
  payId: string | null;
  bill: BillInquiry | null;
}

function validateField(f: ServiceField, raw: string): string {
  const v = String(raw ?? "").trim();
  if (!v) return f.type === "select" ? `Pilih ${f.label.toLowerCase()}.` : `${f.label} wajib diisi.`;
  const r = f.rule;
  if (!r) return "";
  if (r.type === "digits") {
    if (!/^\d+$/.test(v)) return `${f.label} hanya boleh berisi angka.`;
    if (v.length < r.min || v.length > r.max)
      return `${f.label} harus ${r.min === r.max ? r.min : `${r.min}–${r.max}`} digit.`;
  }
  if (r.type === "phone" && !/^08\d{8,12}$/.test(v)) return "Nomor HP diawali 08 dan terdiri dari 10–14 digit.";
  if (r.type === "regex" && !r.re.test(v)) return r.msg;
  if (r.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Format email belum benar.";
  return "";
}

export default function OrderModal({ target, onClose }: { target: OrderTarget | null; onClose: () => void }) {
  const { toast, consumePromo, openInvoice } = useUI();
  const svc = target ? getService(target.kind, target.id) : null;
  const [state, setState] = useState<OrderState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productError, setProductError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ text: string; tone: "ok" | "err" | "warn" } | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  const open = !!target && !!svc;

  // Initialize state when a new target is opened
  useEffect(() => {
    if (!target || !svc) {
      setState(null);
      return;
    }
    const initial: OrderState = {
      values: {},
      touched: {},
      products: svc.products ? [...svc.products] : [],
      productId: null,
      promoCode: null,
      payId: null,
      bill: null,
    };
    if (target.productId && initial.products.some((p) => p.id === target.productId)) {
      initial.productId = target.productId;
    }
    setState(initial);
    setErrors({});
    setProductError("");
    setPaymentError("");
    setPromoMsg(null);
    setPromoInput("");
    setConfirmOpen(false);
    setInquiryLoading(false);
    setCreating(false);
    setIsFirst(TxStore.localCount() === 0);
    // apply pending promo or one passed via target
    const code = target.promo ?? consumePromo();
    if (code) {
      window.setTimeout(() => applyPromo(code, initial), 0);
    }
    if (target.productId) {
      const label = getProduct(target.kind, target.id, target.productId)?.label ?? "Produk";
      toast({ msg: `${label} dipilih. Lengkapi data untuk melanjutkan.`, type: "info", duration: 3000 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.kind, target?.id, target?.productId, target?.promo]);

  const promo = useMemo(() => (state?.promoCode ? PROMOS.find((p) => p.code === state.promoCode) ?? null : null), [state?.promoCode]);

  const pricing = useMemo(() => {
    if (!svc || !state) return null;
    const p = state.products.find((p) => p.id === state.productId) ?? null;
    return { p, ...Pricing.compute({ subtotal: p ? p.price : 0, promo, kind: svc.kind, payId: state.payId, isFirst }) };
  }, [svc, state, promo, isFirst]);

  const updateSummaryMsg = useCallback(
    (next: OrderState) => {
      if (!svc) return;
      if (next.promoCode) {
        const p = PROMOS.find((x) => x.code === next.promoCode) ?? null;
        const sub = next.products.find((x) => x.id === next.productId)?.price ?? 0;
        const s = p ? Promos.evaluate(p, { kind: svc.kind, subtotal: sub, isFirst }) : null;
        setPromoMsg(
          s && s.ok
            ? { text: `Kode ${p!.code} dipakai — hemat ${idr(s.amount)}.`, tone: "ok" }
            : s
              ? { text: s.reason, tone: "warn" }
              : null,
        );
      }
    },
    [svc, isFirst],
  );

  const patch = useCallback(
    (fn: (s: OrderState) => OrderState) => {
      setState((s) => {
        if (!s) return s;
        const next = fn(s);
        updateSummaryMsg(next);
        return next;
      });
    },
    [updateSummaryMsg],
  );

  function applyPromo(raw: string, base?: OrderState) {
    const code = String(raw || "").trim().toUpperCase();
    if (!svc) return;
    if (!code) {
      setPromoMsg({ text: "Masukkan kode promo terlebih dahulu.", tone: "err" });
      return;
    }
    const found = PROMOS.find((p) => p.code === code);
    if (!found) {
      patch((s) => ({ ...s, promoCode: null }));
      setPromoMsg({ text: `Kode “${code}” tidak ditemukan.`, tone: "err" });
      setPromoInput(code);
      return;
    }
    const sub = (base ?? state)?.products.find((x) => x.id === (base ?? state)?.productId)?.price ?? 0;
    const s = Promos.evaluate(found, { kind: svc.kind, subtotal: sub, isFirst });
    if (!s.ok && s.hard) {
      patch((st) => ({ ...st, promoCode: null }));
      setPromoMsg({ text: s.reason, tone: "err" });
      setPromoInput(code);
      return;
    }
    patch((st) => ({ ...st, promoCode: found.code }));
    setPromoInput(code);
    setPromoMsg(
      s.ok
        ? { text: `Kode ${found.code} dipakai — hemat ${idr(s.amount)}.`, tone: "ok" }
        : { text: s.reason, tone: "warn" },
    );
    if (s.ok) toast({ msg: `Kode ${code} berhasil dipakai.`, type: "success" });
  }

  const onFieldChange = (f: ServiceField, value: string) => {
    if (!svc) return;
    let v = value;
    if (f.type !== "select" && f.rule && (f.rule.type === "digits" || f.rule.type === "phone")) {
      v = v.replace(/\D/g, "");
    }
    patch((s) => {
      const next = { ...s, values: { ...s.values, [f.id]: v } };
      if (f.id === "custId" && s.bill) {
        next.bill = null;
        next.products = [];
        next.productId = null;
      }
      return next;
    });
    if (state?.touched[f.id]) setErrors((e) => ({ ...e, [f.id]: validateField(f, v) }));
  };

  const onFieldBlur = (f: ServiceField, value: string) => {
    setState((s) => (s ? { ...s, touched: { ...s.touched, [f.id]: true } } : s));
    setErrors((e) => ({ ...e, [f.id]: validateField(f, value) }));
  };

  const runInquiry = async () => {
    if (!svc || !state) return;
    const f = svc.fields.find((f) => f.id === "custId");
    if (!f) return;
    const msg = validateField(f, state.values.custId ?? "");
    setErrors((e) => ({ ...e, custId: msg }));
    if (msg) return;
    setInquiryLoading(true);
    try {
      const bill = await api.inquireBill(svc, state.values.custId ?? "");
      patch((s) => ({ ...s, bill, products: [{ id: "bill", label: bill.label, price: bill.price, tag: "Tagihan" }], productId: "bill" }));
      setProductError("");
    } finally {
      setInquiryLoading(false);
    }
  };

  const validateAll = (): boolean => {
    if (!svc || !state) return false;
    const nextErrors: Record<string, string> = {};
    svc.fields.forEach((f) => {
      nextErrors[f.id] = validateField(f, state.values[f.id] ?? "");
    });
    setErrors(nextErrors);
    const hasFieldError = Object.values(nextErrors).some(Boolean);
    const noProduct = !state.productId;
    const noPayment = !state.payId;
    setProductError(noProduct ? (svc.inquiry ? "Cek tagihan terlebih dahulu." : "Pilih nominal terlebih dahulu.") : "");
    setPaymentError(noPayment ? "Pilih metode pembayaran." : "");
    return !hasFieldError && !noProduct && !noPayment;
  };

  const handleProceed = () => {
    if (validateAll()) setConfirmOpen(true);
    else toast({ msg: "Periksa kembali data pesananmu.", type: "error" });
  };

  const payload = (): OrderPayload | null => {
    if (!svc || !state || !pricing?.p) return null;
    const pay = findPayment(state.payId);
    if (!pay) return null;
    return {
      kind: svc.kind,
      serviceId: svc.id,
      serviceName: svc.name,
      productLabel: pricing.p.label,
      fields: svc.fields.map((f) => ({ label: f.label, value: state.values[f.id] ?? "", secret: f.type !== "select" })),
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      promoCode: pricing.discount && promo ? promo.code : null,
      fee: pricing.fee,
      total: pricing.total,
      paymentId: pay.id,
      paymentName: pay.name,
    };
  };

  const submitOrder = async () => {
    if (!payload()) return;
    setCreating(true);
    try {
      const tx = await api.createOrder(payload()!);
      setConfirmOpen(false);
      onClose();
      openInvoice(tx.id);
      toast({ msg: "Invoice berhasil dibuat.", type: "success" });
    } catch {
      toast({ msg: "Gagal membuat invoice. Coba lagi.", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  if (!open || !svc || !state || !pricing) return null;

  const targetText =
    svc.fields.map((f) => state.values[f.id]).filter(Boolean).map((v, i) => (i === 1 && svc.id === "mlbb" ? `(${v})` : v)).join(" ") || "–";

  const operator = OPERATORS.find(([, re]) => re.test(state.values.phone ?? ""))?.[0];

  const orderHead = (
    <>
      {svc.kind === "game" ? (
        <img src={svc.cover!} width={40} height={50} alt="" />
      ) : (
        <span className={`modal__ico tone-${svc.tone}`}><i className={`fa-solid ${svc.icon}`} aria-hidden="true" /></span>
      )}
      <h2 id="orderTitle">{svc.name}<small>{svc.subtitle}</small></h2>
    </>
  );

  return (
    <>
      <Modal
        id="orderModal"
        title={orderHead}
        onClose={onClose}
        size="lg"
        labeledBy="orderTitle"
        footClassName="order-bar"
        footId="orderBar"
        footer={
          <>
            <div className="order-bar__total"><small>Total bayar</small><strong id="barTotal">{idr(pricing.total)}</strong></div>
            <button className="btn btn--primary" type="button" onClick={handleProceed}>
              Lanjutkan Pembayaran
            </button>
          </>
        }
      >
        <div className="order">
          <form
            id="orderForm"
            className="order__form"
            noValidate
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleProceed();
            }}
          >
            <fieldset className="step-box">
              <legend><span className="step-num">1</span> {svc.stepTitle}</legend>
              <div className={svc.layout ? `field-row field-row--${svc.layout === "split" ? "2" : "even"}` : undefined}>
                {svc.fields.map((f) => {
                  const id = `f-${f.id}`;
                  const err = errors[f.id] ?? "";
                  const describedBy = `${id}-hint ${id}-err`;
                  const control =
                    f.type === "select" ? (
                      <select
                        className="input"
                        id={id}
                        name={f.id}
                        aria-describedby={describedBy}
                        required
                        value={state.values[f.id] ?? ""}
                        onChange={(e) => onFieldChange(f, e.target.value)}
                        onBlur={(e) => onFieldBlur(f, e.target.value)}
                        aria-invalid={err ? true : false}
                      >
                        <option value="">Pilih {f.label.toLowerCase()}</option>
                        {(f.options ?? []).map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className={`input${err ? "" : state.values[f.id]?.trim() ? " is-valid" : ""}`}
                        id={id}
                        name={f.id}
                        type={f.type === "email" ? "email" : "text"}
                        inputMode={f.inputmode as React.HTMLAttributes<HTMLInputElement>["inputMode"]}
                        placeholder={f.ph}
                        maxLength={f.maxlength ?? 40}
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        aria-describedby={describedBy}
                        required
                        value={state.values[f.id] ?? ""}
                        onChange={(e) => onFieldChange(f, e.target.value)}
                        onBlur={(e) => onFieldBlur(f, e.target.value)}
                        aria-invalid={err ? true : false}
                      />
                    );
                  const inquiryBtn =
                    svc.inquiry && f.id === "custId" ? (
                      <button className={`btn btn--outline${inquiryLoading ? " is-loading" : ""}`} type="button" onClick={runInquiry} disabled={inquiryLoading}>
                        Cek Tagihan
                      </button>
                    ) : null;
                  return (
                    <div className="field" key={f.id}>
                      <label htmlFor={id}>{f.label}</label>
                      {inquiryBtn ? (
                        <div className="input-group">{control}{inquiryBtn}</div>
                      ) : (
                        control
                      )}
                      {f.id === "phone" && operator ? (
                        <p className="field__hint" id={`${id}-hint`}><span className="op-chip"><i className="fa-solid fa-signal" aria-hidden="true" /> {operator}</span></p>
                      ) : (
                        <p className="field__hint" id={`${id}-hint`}>{f.hint}</p>
                      )}
                      <p className="field__error" id={`${id}-err`} role="alert">{err}</p>
                    </div>
                  );
                })}
              </div>
              {svc.kind === "game" && (
                <p className="field__hint"><i className="fa-solid fa-circle-info" aria-hidden="true" /> Verifikasi nickname otomatis akan aktif setelah terhubung ke API provider.</p>
              )}
              {state.bill && (
                <div className="bill" role="status">
                  <b><i className="fa-solid fa-circle-check" aria-hidden="true" /> Tagihan ditemukan</b>
                  <dl>
                    <div><dt>Nama pelanggan</dt><dd>{state.bill.name}</dd></div>
                    <div><dt>Periode</dt><dd>{state.bill.period}</dd></div>
                    <div><dt>Tagihan</dt><dd>{idr(state.bill.amount)}</dd></div>
                    <div><dt>Biaya layanan</dt><dd>{idr(state.bill.admin)}</dd></div>
                  </dl>
                </div>
              )}
            </fieldset>

            <fieldset className="step-box">
              <legend><span className="step-num">2</span> {svc.inquiry ? "Tagihan" : svc.kind === "game" ? `Pilih Nominal ${svc.currency}` : "Pilih Nominal"}</legend>
              {svc.inquiry && state.products.length === 0 ? (
                <p className="field__hint"><i className="fa-solid fa-circle-info" aria-hidden="true" /> Masukkan nomor pelanggan lalu tekan “Cek Tagihan” untuk menampilkan jumlah yang harus dibayar.</p>
              ) : (
                <div className="opt-grid">
                  {state.products.map((p) => (
                    <label className="opt" key={p.id}>
                      <input
                        className="opt__input"
                        type="radio"
                        name="product"
                        value={p.id}
                        checked={state.productId === p.id}
                        onChange={() => {
                          setState((s) => (s ? { ...s, productId: p.id } : s));
                          setProductError("");
                        }}
                      />
                      <span className="opt__card">
                        {p.tag ? <span className="opt__tag">{p.tag}</span> : null}
                        <span className="opt__name">{p.label}</span>
                        <span className="opt__price">{idr(p.price)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <p className="field__error" id="err-product" role="alert">{productError}</p>
            </fieldset>

            <fieldset className="step-box">
              <legend><span className="step-num">3</span> Kode Promo</legend>
              <div className="promo-row">
                <label className="sr-only" htmlFor="promoInput">Kode promo</label>
                <input
                  className="input"
                  id="promoInput"
                  type="text"
                  placeholder="Masukkan kode"
                  maxLength={16}
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="promoMsg"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyPromo(promoInput);
                    }
                  }}
                />
                <button className="btn btn--outline" type="button" onClick={() => applyPromo(promoInput)}>Terapkan</button>
              </div>
              <p className={`promo-msg${promoMsg ? ` is-${promoMsg.tone}` : ""}`} id="promoMsg" role="status" aria-live="polite">
                {promoMsg && (
                  <>
                    <i className={`fa-solid ${promoMsg.tone === "ok" ? "fa-circle-check" : promoMsg.tone === "err" ? "fa-circle-exclamation" : "fa-circle-info"}`} aria-hidden="true" />
                    <span>
                      {promoMsg.text}
                      {state.promoCode && (
                        <>{" "}<button type="button" style={{ textDecoration: "underline", fontWeight: 700 }} onClick={() => {
                          setState((s) => (s ? { ...s, promoCode: null } : s));
                          setPromoInput("");
                          setPromoMsg({ text: "Kode promo dihapus.", tone: "warn" });
                        }}>Hapus</button></>
                      )}
                    </span>
                  </>
                )}
              </p>
              <div className="promo-suggest" aria-label="Contoh kode promo">
                {PROMOS.map((p) => (
                  <button className="chip" type="button" key={p.code} title={p.desc} onClick={() => applyPromo(p.code)}>
                    {p.code}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="step-box">
              <legend><span className="step-num">4</span> Metode Pembayaran</legend>
              <div className="pay-list">
                {[
                  { id: "qris" }, { id: "dana" }, { id: "ovo" }, { id: "gopay" }, { id: "shopeepay" }, { id: "va" }, { id: "bank" },
                ].map(({ id }) => {
                  const p = findPayment(id)!;
                  return (
                    <label className="opt pay" key={p.id}>
                      <input
                        className="opt__input"
                        type="radio"
                        name="payment"
                        value={p.id}
                        checked={state.payId === p.id}
                        onChange={() => {
                          setState((s) => (s ? { ...s, payId: p.id } : s));
                          setPaymentError("");
                        }}
                      />
                      <span className="opt__card">
                        <span className="pay-logo" style={{ "--pc": p.color } as React.CSSProperties} aria-hidden="true">{p.code}</span>
                        <span className="opt__name">
                          {p.name}
                          <small>{p.desc} · {feeText(p)}</small>
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <p className="field__error" id="err-payment" role="alert">{paymentError}</p>
            </fieldset>
          </form>

          <aside className="summary" aria-label="Ringkasan transaksi">
            <h3><i className="fa-solid fa-receipt" style={{ color: "var(--brand)" }} aria-hidden="true" /> Ringkasan Transaksi</h3>
            <div className="summary__svc">
              {svc.kind === "game" ? (
                <img src={svc.cover!} width={36} height={45} alt="" />
              ) : (
                <span className={`modal__ico tone-${svc.tone}`} style={{ width: 36, height: 36, fontSize: "1rem" }}>
                  <i className={`fa-solid ${svc.icon}`} aria-hidden="true" />
                </span>
              )}
              <span>{svc.name}</span>
            </div>
            <dl className="kv">
              <div><dt>Tujuan</dt><dd>{targetText}</dd></div>
              <div><dt>Produk</dt><dd>{pricing.p ? pricing.p.label : "Belum dipilih"}</dd></div>
              <div><dt>Harga</dt><dd>{idr(pricing.subtotal)}</dd></div>
              {pricing.discount > 0 && (
                <div className="is-discount">
                  <dt>Diskon {promo ? `(${promo.code})` : ""}</dt>
                  <dd>{idr(-pricing.discount)}</dd>
                </div>
              )}
              <div><dt>Biaya admin</dt><dd>{state.payId ? idr(pricing.fee) : "—"}</dd></div>
              <div><dt>Pembayaran</dt><dd>{findPayment(state.payId)?.name ?? "Belum dipilih"}</dd></div>
            </dl>
            <div className="summary__total"><span>Total Bayar</span><strong id="sumTotal">{idr(pricing.total)}</strong></div>
            <button className="btn btn--primary btn--block summary__submit" type="button" onClick={handleProceed}>
              Lanjutkan Pembayaran <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
            <p className="summary__note"><i className="fa-solid fa-shield-halved" aria-hidden="true" /><span>Periksa kembali rincian pesanan sebelum melanjutkan.</span></p>
          </aside>
        </div>
      </Modal>

      {confirmOpen && (
        <Modal id="confirmModal" title={<h2 id="confirmTitle">Konfirmasi Pesanan</h2>} onClose={() => setConfirmOpen(false)} size="sm" labeledBy="confirmTitle"
          footer={
            <>
              <button className="btn btn--outline" type="button" onClick={() => setConfirmOpen(false)}>Ubah Pesanan</button>
              <button className={`btn btn--primary${creating ? " is-loading" : ""}`} type="button" id="confirmGo" onClick={submitOrder} disabled={creating}>
                <i className="fa-solid fa-file-invoice" aria-hidden="true" /> Buat Invoice
              </button>
            </>
          }
        >
          <div className="notice"><i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /><span>Periksa data dengan teliti sebelum melanjutkan.</span></div>
          <div className="confirm-list">
            <dl className="kv">
              <div><dt>Layanan</dt><dd>{svc.name}</dd></div>
              {svc.fields.map((f) => (
                <div key={f.id}><dt>{f.label}</dt><dd>{state.values[f.id]}</dd></div>
              ))}
              <div><dt>Produk</dt><dd>{pricing.p?.label}</dd></div>
              <div><dt>Harga</dt><dd>{idr(pricing.subtotal)}</dd></div>
              {pricing.discount > 0 && <div className="is-discount"><dt>Diskon ({promo?.code})</dt><dd>{idr(-pricing.discount)}</dd></div>}
              <div><dt>Biaya admin</dt><dd>{idr(pricing.fee)}</dd></div>
              <div><dt>Pembayaran</dt><dd>{findPayment(state.payId)?.name}</dd></div>
              <div className="is-total"><dt>Total Bayar</dt><dd>{idr(pricing.total)}</dd></div>
            </dl>
          </div>
        </Modal>
      )}
    </>
  );
}
