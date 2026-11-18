import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { copyText, fmtDate, idr, mask, STATUS, TxStore, onTxChange, reduceMotion } from "@/lib";
import type { Tx as TxType } from "@/lib/types";
import Modal from "./Modal";
import { useUI } from "./UIProvider";

const GUIDE: Record<string, [string, string, string]> = {
  qris: ["fa-qrcode", "Kode QR", "Scan kode QR menggunakan aplikasi pembayaran Anda."],
  va: ["fa-building-columns", "Nomor Virtual Account", "Gunakan nomor virtual account untuk menyelesaikan pembayaran."],
  bank: ["fa-money-bill-transfer", "Transfer Bank", "Lakukan transfer ke rekening tujuan yang tertera."],
};

function guideFor(tx: TxType): [string, string, string] {
  return GUIDE[tx.paymentId] ?? ["fa-mobile-screen", `Pembayaran via ${tx.paymentName}`, `Selesaikan pembayaran melalui ${tx.paymentName}.`];
}

function simulate(action: string, id: string) {
  const tx = TxStore.find(id);
  if (!tx) return;
  if (action === "pay" && tx.status === "pending") {
    TxStore.setStatus(id, "processing", "Pembayaran diterima. Pesanan sedang diproses.");
  } else if (action === "cancel" && tx.status === "pending") {
    TxStore.setStatus(id, "cancelled", "Dibatalkan oleh pengguna.");
  } else if (action === "done" && tx.status === "processing") {
    TxStore.setStatus(id, "success", "Pesanan selesai diproses.");
  } else if (action === "fail" && tx.status === "processing") {
    TxStore.setStatus(id, "failed", "Provider gagal memproses. Dana dikembalikan.");
  }
}

export default function InvoiceModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { toast } = useUI();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [tx, setTx] = useState<TxType | null>(null);
  const [, force] = useState(0);

  const refresh = useCallback(() => {
    if (id) setTx(TxStore.find(id));
  }, [id]);

  useEffect(() => {
    TxStore.settle();
    refresh();
    const off = onTxChange(() => {
      refresh();
      force((n) => n + 1);
    });
    return off;
  }, [refresh]);

  // Auto-settle processing → success after 3.5s
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

  const checkStatus = () => {
    onClose();
    if (pathname?.startsWith("/cek-transaksi")) {
      window.setTimeout(() => window.dispatchEvent(new CustomEvent("kaizora:track", { detail: tx.id })), 200);
    } else {
      navigate(`/cek-transaksi?inv=${encodeURIComponent(tx.id)}`);
    }
  };

  return (
    <Modal
      id="invoiceModal"
      title={<h2 id="invoiceTitle">Invoice</h2>}
      onClose={onClose}
      size="sm"
      labeledBy="invoiceTitle"
      footer={
        <>
          {tx.status === "pending" && (
            <button
              className="btn btn--outline"
              type="button"
              data-sim="pay"
              data-id={tx.id}
              onClick={() => {
                simulate("pay", tx.id);
                toast({ msg: "Pembayaran diterima, pesanan diproses.", type: "info", icon: "fa-gear" });
              }}
            >
              <i className="fa-solid fa-check" aria-hidden="true" /> Konfirmasi Bayar
            </button>
          )}
          <button className="btn btn--primary" type="button" data-check={tx.id} onClick={checkStatus}>
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" /> Cek Status
          </button>
        </>
      }
    >
      <div className="inv-hero">
        <div className="inv-check"><i className="fa-solid fa-file-circle-check" aria-hidden="true" /></div>
        <h3>Invoice Dibuat</h3>
        <p>Simpan nomor ini untuk mengecek status pesanan.</p>
      </div>
      <div className="inv-id">
        <code>{tx.id}</code>
        <button className="btn btn--outline btn--sm" type="button" onClick={async () => {
          const okCopy = await copyText(tx.id);
          toast({ msg: okCopy ? "Nomor invoice disalin." : "Tidak dapat menyalin otomatis. Salin manual ya.", type: okCopy ? "success" : "error" });
        }}>
          <i className="fa-solid fa-copy" aria-hidden="true" /> Salin
        </button>
      </div>
      <p style={{ marginBottom: 12 }}>
        <span className={`status status--${tx.status}`}><i className={`fa-solid ${s.icon}`} aria-hidden="true" /> {s.label}</span>
      </p>
      {tx.status === "pending" && (
        <div className="pay-guide">
          <span className="pay-guide__box"><i className={`fa-solid ${guideFor(tx)[0]}`} aria-hidden="true" /></span>
          <div><b>{guideFor(tx)[1]}</b>{guideFor(tx)[2]}</div>
        </div>
      )}
      <div className="confirm-list">
        <dl className="kv">
          <div><dt>Layanan</dt><dd>{tx.serviceName}</dd></div>
          {tx.fields.map((f, i) => (
            <div key={i}><dt>{f.label}</dt><dd>{f.secret ? mask(f.value) : f.value}</dd></div>
          ))}
          <div><dt>Produk</dt><dd>{tx.productLabel}</dd></div>
          <div><dt>Metode</dt><dd>{tx.paymentName}</dd></div>
          {tx.discount > 0 && <div className="is-discount"><dt>Diskon ({tx.promoCode})</dt><dd>{idr(-tx.discount)}</dd></div>}
          <div className="is-total"><dt>Total</dt><dd>{idr(tx.total)}</dd></div>
        </dl>
      </div>
    </Modal>
  );
}
