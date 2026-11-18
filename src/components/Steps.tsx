import { Link } from "react-router-dom";
import { PAYMENTS } from "@/lib/data";

export default function Steps() {
  return (
    <section className="section" id="cara" aria-labelledby="cara-title">
      <div className="container">
        <div className="section__head" data-reveal>
          <div>
            <span className="eyebrow"><i className="fa-solid fa-route" aria-hidden="true" /> Cara Kerja</span>
            <h2 id="cara-title">Empat Langkah, Selesai</h2>
          </div>
        </div>
        <ol className="steps">
          <li className="step-card" data-reveal><h3>Pilih layanan</h3><p>Pilih game atau layanan PPOB dari katalog atau akses cepat.</p></li>
          <li className="step-card" data-reveal style={{ "--d": "80ms" } as React.CSSProperties}><h3>Isi data &amp; nominal</h3><p>Masukkan ID akun atau nomor tujuan, lalu pilih produk. Input divalidasi langsung.</p></li>
          <li className="step-card" data-reveal style={{ "--d": "160ms" } as React.CSSProperties}><h3>Pilih pembayaran</h3><p>Pilih metode favoritmu, pasang kode promo, dan cek ringkasan total.</p></li>
          <li className="step-card" data-reveal style={{ "--d": "240ms" } as React.CSSProperties}><h3>Pantau status</h3><p>Simpan nomor invoice, lalu cek status kapan saja di <Link className="link-inline" to="/cek-transaksi">halaman Cek Transaksi</Link>.</p></li>
        </ol>
        <div className="pay-strip" id="payStrip" data-reveal>
          <small>Metode pembayaran yang tersedia saat checkout:</small>
          {PAYMENTS.map((p) => (
            <span className="pay-pill" key={p.id}>
              <span className="pay-logo" style={{ "--pc": p.color } as React.CSSProperties} aria-hidden="true">{p.code}</span>
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
