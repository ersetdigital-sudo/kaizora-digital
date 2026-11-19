"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { STATUS } from "@/lib/data/content";
import { copyText, fmtDate, idr, mask, reduceMotion } from "@/lib/utils";
import { TxStore, onTxChange } from "@/lib/store";
import type { Tx } from "@/types";
import { useUI } from "../ui/UIProvider";

function simulate(action: string, id: string) {
  const tx = TxStore.find(id);
  if (!tx) return;
  if (action === "pay" && tx.status === "pending") TxStore.setStatus(id, "processing", "Pembayaran diterima. Pesanan sedang diproses.");
  else if (action === "cancel" && tx.status === "pending") TxStore.setStatus(id, "cancelled", "Dibatalkan oleh pengguna.");
  else if (action === "done" && tx.status === "processing") TxStore.setStatus(id, "success", "Pesanan selesai diproses.");
  else if (action === "fail" && tx.status === "processing") TxStore.setStatus(id, "failed", "Provider gagal memproses. Dana dikembalikan.");
}

function fmtCountdown(ms: number) {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function InvoiceModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { toast } = useUI();
  const pathname = usePathname();
  const router = useRouter();
  const [tx, setTx] = useState<Tx | null>(null);
  const [now, setNow] = useState(Date.now());

  const refresh = useCallback(() => { if (id) setTx(TxStore.find(id)); }, [id]);

  useEffect(() => {
    TxStore.settle();
    refresh();
    return onTxChange(() => refresh());
  }, [refresh]);

  useEffect(() => {
    if (tx?.status !== "pending") return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [tx?.status, tx?.id]);

  useEffect(() => {
    if (tx?.status !== "processing") return;
    const t = window.setTimeout(() => {
      if (TxStore.find(tx.id)?.status === "processing") {
        TxStore.setStatus(tx.id, "success", "Pesanan selesai diproses.");
        toast({ msg: "Pesanan berhasil diproses.", type: "success" });
      }
    }, reduceMotion() ? 800 : 3500);
    return () => window.clearTimeout(t);
  }, [tx?.status, tx?.id, toast]);

  if (!id || !tx) return null;
  const s = STATUS[tx.status];
  const isQris = tx.paymentId === "qris";
  const expiresAt = tx.createdAt + siteConfig.payment.qrisTimerSeconds * 1000;
  const remaining = expiresAt - now;

  const checkStatus = () => {
    onClose();
    if (pathname?.startsWith("/cek-transaksi")) {
      window.setTimeout(() => window.dispatchEvent(new CustomEvent("kaizora:track", { detail: tx.id })), 200);
    } else {
      router.push(`/cek-transaksi?inv=${encodeURIComponent(tx.id)}`);
    }
  };

  return (
    <Modal id="invoiceModal" title={<h2 id="invoiceTitle">Invoice</h2>} onClose={onClose} size="sm" labeledBy="invoiceTitle"
      footer={<>
        {tx.status === "pending" && (
          <button className="btn btn--outline" type="button" onClick={() => { simulate("pay", tx.id); toast({ msg: "Pembayaran diterima, pesanan diproses.", type: "info", icon: "fa-gear" }); }}>
            <Icon name="fa-circle-check" /> Konfirmasi Bayar
          </button>
        )}
        <button className="btn btn--primary" type="button" onClick={checkStatus}><Icon name="fa-magnifying-glass" /> Cek Status</button>
      </>}>
      <div className="inv-hero">
        <div className="inv-check"><Icon name="fa-file-circle-check" /></div>
        <h3>Invoice Dibuat</h3>
        <p>Simpan nomor ini untuk mengecek status pesanan.</p>
      </div>
      <div className="inv-id">
        <code>{tx.id}</code>
        <button className="btn btn--outline btn--sm" type="button" onClick={async () => {
          const okCopy = await copyText(tx.id);
          toast({ msg: okCopy ? "Nomor invoice disalin." : "Tidak dapat menyalin otomatis. Salin manual ya.", type: okCopy ? "success" : "error" });
        }}><Icon name="fa-copy" /> Salin</button>
      </div>
      <p style={{ marginBottom: 12 }}>
        <span className={`status status--${tx.status}`}><Icon name={s.icon} /> {s.label}</span>
      </p>

      {tx.status === "pending" && isQris && (
        <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", background: "#fff", marginBottom: 16 }}>
          <div style={{ background: "var(--ink-900)", color: "#fff", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "grid", placeItems: "center" }}>
                <Icon name="fa-qrcode" />
              </span>
              <span>Pembayaran QRIS</span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.14)" }}>
              <Icon name={s.icon} /> {s.label}
            </span>
          </div>

          <div style={{ padding: 20, display: "grid", gap: 16, justifyItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Total Pembayaran</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: "var(--ink-900)", lineHeight: 1.1 }}>
                {idr(tx.total)}
              </div>
            </div>

            <div style={{ background: "#fff", padding: 14, borderRadius: 16, border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
              <img
                src={siteConfig.payment.qrisImage}
                width={220}
                alt="Kode QRIS"
                loading="eager"
                style={{ display: "block", width: 220, maxWidth: "100%", height: "auto", borderRadius: 10 }}
              />
            </div>

            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>Sisa Waktu</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: remaining > 0 ? "var(--ink-900)" : "var(--danger)", fontVariantNumeric: "tabular-nums" }}>
                  {remaining > 0 ? fmtCountdown(remaining) : "Habis"}
                </div>
              </div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>Status</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-900)" }}>{s.label}</div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
              Scan kode QRIS menggunakan aplikasi pembayaran Anda.
            </p>
          </div>
        </div>
      )}

      {tx.status === "pending" && !isQris && (
        <div className="pay-guide">
          <span className="pay-guide__box"><Icon name={tx.paymentId === "va" ? "fa-building-columns" : tx.paymentId === "bank" ? "fa-money-bill-transfer" : "fa-wallet"} /></span>
          <div><b>Pembayaran via {tx.paymentName}</b>Selesaikan pembayaran melalui {tx.paymentName}. (Simulasi demo)</div>
        </div>
      )}

      <div className="confirm-list">
        <dl className="kv">
          <div><dt>Layanan</dt><dd>{tx.serviceName}</dd></div>
          {tx.fields.map((f, i) => (<div key={i}><dt>{f.label}</dt><dd>{f.secret ? mask(f.value) : f.value}</dd></div>))}
          <div><dt>Produk</dt><dd>{tx.productLabel}</dd></div>
          <div><dt>Metode</dt><dd>{tx.paymentName}</dd></div>
          {tx.discount > 0 && <div className="is-discount"><dt>Diskon ({tx.promoCode})</dt><dd>{idr(-tx.discount)}</dd></div>}
          <div className="is-total"><dt>Total</dt><dd>{idr(tx.total)}</dd></div>
        </dl>
      </div>
    </Modal>
  );
}
