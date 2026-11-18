import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  api,
  fmtDate,
  idr,
  mask,
  reduceMotion,
  STATUS,
  TxStore,
  onTxChange,
} from "@/lib";
import type { Tx } from "@/lib/types";
import { useUI } from "./UIProvider";

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

function ResultView({ tx, onOrder }: { tx: Tx; onOrder: (kind: "game" | "ppob", id: string) => void }) {
  const s = STATUS[tx.status];
  return (
    <>
      <div className="result__head">
        <div>
          <small style={{ color: "var(--muted)" }}>Nomor Invoice</small>
          <div className="result__id">{tx.id}</div>
        </div>
        <span className={`status status--${tx.status}`}>
          <i className={`fa-solid ${s.icon}`} aria-hidden="true" /> {s.label}
        </span>
      </div>
      <div className={`result__banner status--${tx.status}`}>
        <i className={`fa-solid ${s.icon}`} aria-hidden="true" />
        <div><b>{s.label}</b><p>{s.desc}</p></div>
      </div>
      <dl className="kv">
        <div><dt>Layanan</dt><dd>{tx.serviceName}</dd></div>
        {tx.fields.map((f, i) => (
          <div key={i}><dt>{f.label}</dt><dd>{f.secret ? mask(f.value) : f.value}</dd></div>
        ))}
        <div><dt>Produk</dt><dd>{tx.productLabel}</dd></div>
        <div><dt>Metode</dt><dd>{tx.paymentName}</dd></div>
        <div><dt>Dibuat</dt><dd>{fmtDate(tx.createdAt)}</dd></div>
        {tx.discount > 0 && <div className="is-discount"><dt>Diskon ({tx.promoCode})</dt><dd>{idr(-tx.discount)}</dd></div>}
        <div className="is-total"><dt>Total</dt><dd>{idr(tx.total)}</dd></div>
      </dl>
      <h4 style={{ margin: "22px 0 10px", fontSize: "1rem" }}>Riwayat Status</h4>
      <ol className="timeline">
        {[...tx.history].reverse().map((h, i) => (
          <li className={`is-${h.status}`} key={i}>
            <b>{STATUS[h.status].label}</b>
            <small>{fmtDate(h.at)} · {h.note}</small>
          </li>
        ))}
      </ol>
      {(tx.status === "pending" || tx.status === "processing") ? (
        <div className="sim">
          <div>
            {tx.status === "pending" ? (
              <>
                <button className="btn btn--primary btn--sm" type="button" onClick={() => simulate("pay", tx.id)}>Konfirmasi Pembayaran</button>
                <button className="btn btn--outline btn--sm" type="button" onClick={() => simulate("cancel", tx.id)}>Batalkan Transaksi</button>
              </>
            ) : (
              <>
                <button className="btn btn--primary btn--sm" type="button" onClick={() => simulate("done", tx.id)}>Tandai Berhasil</button>
                <button className="btn btn--outline btn--sm" type="button" onClick={() => simulate("fail", tx.id)}>Tandai Gagal</button>
              </>
            )}
          </div>
        </div>
      ) : null}
      {(tx.status === "failed" || tx.status === "cancelled" || tx.status === "success") && (
        <button className="btn btn--outline btn--block" style={{ marginTop: 16 }} type="button" onClick={() => onOrder(tx.kind, tx.serviceId)}>
          <i className="fa-solid fa-rotate-right" aria-hidden="true" /> Pesan Lagi
        </button>
      )}
    </>
  );
}

export default function Tracker({ initialInvoice }: { initialInvoice?: string | null }) {
  const { openOrder, confirmInfo, toast } = useUI();
  const [input, setInput] = useState(initialInvoice ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Tx | null>(null);
  const [missing, setMissing] = useState<string | null>(null);
  const [history, setHistory] = useState<Tx[]>([]);
  const [searchParams] = useSearchParams();

  const refreshHistory = useCallback(() => setHistory(TxStore.local().slice(0, 5)), []);

  const lookup = useCallback(async (raw: string, opts?: { scroll?: boolean }) => {
    const id = String(raw || "").trim().toUpperCase();
    setInput(id);
    if (!id) { setError("Masukkan nomor invoice terlebih dahulu."); return; }
    if (!/^INV-[A-Z0-9]+(-[A-Z0-9]+)*$/.test(id)) {
      setError("Format tidak valid. Contoh: INV-240101-AB12C.");
      return;
    }
    setError("");
    setLoading(true);
    setMissing(null);
    if (opts?.scroll) document.getElementById("cek")?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
    try {
      const tx = await api.getTransaction(id);
      if (tx) setResult(tx);
      else { setResult(null); setMissing(id); }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshHistory(); TxStore.settle(); }, [refreshHistory]);
  useEffect(() => onTxChange(() => {
    refreshHistory();
    setResult((cur) => (cur ? TxStore.find(cur.id) ?? cur : cur));
  }), [refreshHistory]);

  useEffect(() => {
    const q = searchParams.get("inv") ?? initialInvoice;
    if (q) lookup(q);
    const onTrack = (e: Event) => lookup((e as CustomEvent<string>).detail);
    window.addEventListener("kaizora:track", onTrack as EventListener);
    return () => window.removeEventListener("kaizora:track", onTrack as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <section className="section" id="cek" aria-label="Pencarian transaksi">
      <div className="container">
        <div className="track">
          <div className="card track__search" data-reveal>
            <h3>Nomor Invoice</h3>
            <p>Masukkan nomor invoice untuk melihat status pesanan.</p>
            <form className="track-form" id="trackForm" noValidate onSubmit={(e) => { e.preventDefault(); lookup(input); }}>
              <div className="field">
                <label htmlFor="trackInput">Nomor invoice / transaksi</label>
                <input
                  className="input" id="trackInput" name="invoice" type="text"
                  placeholder="INV-..." autoComplete="off" autoCapitalize="characters" spellCheck={false}
                  aria-describedby="trackError" required
                  value={input}
                  onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(""); }}
                  aria-invalid={error ? true : false}
                />
                <p className="field__error" id="trackError" role="alert">{error}</p>
              </div>
              <button className={`btn btn--primary btn--block${loading ? " is-loading" : ""}`} type="submit" id="trackBtn" disabled={loading}>
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true" /> Cek Status
              </button>
            </form>
            {history.length > 0 && (
              <div className="history" id="historyBox">
                <div className="history__head">
                  <b>Transaksi saya (di perangkat ini)</b>
                  <button type="button" id="historyClear" onClick={() => confirmInfo({
                    title: "Hapus riwayat?",
                    text: "Semua riwayat transaksi di perangkat ini akan dihapus.",
                    label: "Ya, hapus",
                    onConfirm: () => { TxStore.clear(); setHistory([]); setResult(null); toast({ msg: "Riwayat transaksi dihapus.", type: "info" }); },
                  })}>Hapus</button>
                </div>
                <ul id="historyList">
                  {history.map((t) => (
                    <li key={t.id}>
                      <button type="button" onClick={() => lookup(t.id)}>
                        <span><b>{t.id}</b><small>{t.productLabel} · {idr(t.total)}</small></span>
                        <span className={`status status--${t.status}`}>{STATUS[t.status].label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="card result" id="trackResult" data-reveal aria-live="polite">
            {loading ? (
              <>
                <div className="skeleton" style={{ height: 28, width: "60%" }} />
                <div className="skeleton" style={{ height: 80, marginTop: 16 }} />
                <div className="skeleton" style={{ height: 180, marginTop: 16 }} />
              </>
            ) : result ? (
              <ResultView tx={result} onOrder={openOrder} />
            ) : missing ? (
              <div className="result__placeholder">
                <div><i className="fa-solid fa-circle-question" aria-hidden="true" /></div>
                <b>Invoice tidak ditemukan</b>
                <span>Nomor <code>{missing}</code> tidak ditemukan di riwayat perangkat ini.</span>
              </div>
            ) : (
              <div className="result__placeholder">
                <div><i className="fa-solid fa-file-invoice" aria-hidden="true" /></div>
                <b>Belum ada transaksi dicari</b>
                <span>Hasil pencarian akan tampil di sini.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
